"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoot = createRoot;
exports.createRootWithCorePlugins = createRootWithCorePlugins;
exports.createRootWithSettings = createRootWithSettings;
exports.createTestServers = createTestServers;
exports.getOsdServer = getOsdServer;
exports.getSupertest = getSupertest;
exports.request = void 0;

var _devUtils = require("@osd/dev-utils");

var _test = require("@osd/test");

var _lodash = require("lodash");

var _path = require("path");

var _rxjs = require("rxjs");

var _supertest = _interopRequireDefault(require("supertest"));

var _config = require("../server/config");

var _root = require("../server/root");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const DEFAULTS_SETTINGS = {
  server: {
    autoListen: true,
    // Use the ephemeral port to make sure that tests use the first available
    // port and aren't affected by the timing issues in test environment.
    port: 0,
    xsrf: {
      disableProtection: true
    }
  },
  logging: {
    silent: true
  },
  plugins: {},
  migrations: {
    skip: true
  }
};
const DEFAULT_SETTINGS_WITH_CORE_PLUGINS = {
  plugins: {
    scanDirs: [(0, _path.resolve)(__dirname, '../../legacy/core_plugins')]
  },
  opensearch: {
    hosts: [_test.opensearchTestConfig.getUrl()],
    username: _test.opensearchDashboardsServerTestUser.username,
    password: _test.opensearchDashboardsServerTestUser.password
  }
};

function createRootWithSettings(settings, cliArgs = {}) {
  const env = _config.Env.createDefault(_devUtils.REPO_ROOT, {
    configs: [],
    cliArgs: {
      dev: false,
      quiet: false,
      silent: false,
      watch: false,
      repl: false,
      basePath: false,
      runExamples: false,
      disableOptimizer: true,
      cache: true,
      dist: false,
      ...cliArgs
    },
    isDevClusterMaster: false,
    isDevClusterManager: false
  });

  return new _root.Root({
    getConfig$: () => new _rxjs.BehaviorSubject((0, _lodash.defaultsDeep)({}, settings, DEFAULTS_SETTINGS))
  }, env);
}
/**
 * Returns supertest request attached to the core's internal native Node server.
 * @param root
 * @param method
 * @param path
 */


function getSupertest(root, method, path) {
  const testUserCredentials = Buffer.from(`${_test.opensearchDashboardsTestUser.username}:${_test.opensearchDashboardsTestUser.password}`);
  return (0, _supertest.default)(root.server.http.httpServer.server.listener)[method](path).set('Authorization', `Basic ${testUserCredentials.toString('base64')}`);
}
/**
 * Creates an instance of Root with default configuration
 * tailored for unit tests.
 *
 * @param {Object} [settings={}] Any config overrides for this instance.
 * @returns {Root}
 */


function createRoot(settings = {}, cliArgs = {}) {
  return createRootWithSettings(settings, cliArgs);
}
/**
 *  Creates an instance of Root, including all of the core plugins,
 *  with default configuration tailored for unit tests.
 *
 *  @param {Object} [settings={}] Any config overrides for this instance.
 *  @returns {Root}
 */


function createRootWithCorePlugins(settings = {}) {
  return createRootWithSettings((0, _lodash.defaultsDeep)({}, settings, DEFAULT_SETTINGS_WITH_CORE_PLUGINS));
}
/**
 * Returns `osdServer` instance used in the "legacy" OpenSearch Dashboards.
 * @param root
 */


function getOsdServer(root) {
  return root.server.legacy.osdServer;
}

const request = {
  delete: (root, path) => getSupertest(root, 'delete', path),
  get: (root, path) => getSupertest(root, 'get', path),
  head: (root, path) => getSupertest(root, 'head', path),
  post: (root, path) => getSupertest(root, 'post', path),
  put: (root, path) => getSupertest(root, 'put', path)
};
exports.request = request;

/**
 * Creates an instance of the Root, including all of the core "legacy" plugins,
 * with default configuration tailored for unit tests, and starts opensearch.
 *
 * @param options
 * @prop settings Any config overrides for this instance.
 * @prop adjustTimeout A function(t) => this.timeout(t) that adjust the timeout of a
 * test, ensuring the test properly waits for the server to boot without timing out.
 */
function createTestServers({
  adjustTimeout,
  settings = {}
}) {
  if (!adjustTimeout) {
    throw new Error('adjustTimeout is required in order to avoid flaky tests');
  }

  const license = (0, _lodash.get)(settings, 'opensearch.license', 'oss');
  const usersToBeAdded = (0, _lodash.get)(settings, 'users', []);

  if (usersToBeAdded.length > 0) {
    if (license !== 'trial') {
      throw new Error('Adding users is only supported by createTestServers when using a trial license');
    }
  }

  const log = new _devUtils.ToolingLog({
    level: 'debug',
    writeTo: process.stdout
  });
  log.indent(6);
  log.info('starting opensearch');
  log.indent(4);
  const opensearch = (0, _test.createLegacyOpenSearchTestCluster)((0, _lodash.defaultsDeep)({}, (0, _lodash.get)(settings, 'opensearch', {}), {
    log,
    license
  }));
  log.indent(-4); // Add time for OSD and adding users

  adjustTimeout(opensearch.getStartTimeout() + 100000);
  const osdSettings = (0, _lodash.get)(settings, 'osd', {});
  return {
    startOpenSearch: async () => {
      await opensearch.start((0, _lodash.get)(settings, 'opensearch.opensearchArgs', []));

      if (['gold', 'trial'].includes(license)) {
        // Override provided configs
        osdSettings.opensearch = {
          hosts: [_test.opensearchTestConfig.getUrl()],
          username: _test.opensearchDashboardsServerTestUser.username,
          password: _test.opensearchDashboardsServerTestUser.password
        };
      }

      return {
        stop: async () => await opensearch.cleanup(),
        opensearch,
        hosts: [_test.opensearchTestConfig.getUrl()],
        username: _test.opensearchDashboardsServerTestUser.username,
        password: _test.opensearchDashboardsServerTestUser.password
      };
    },
    startOpenSearchDashboards: async () => {
      const root = createRootWithCorePlugins(osdSettings);
      await root.setup();
      const coreStart = await root.start();
      const osdServer = getOsdServer(root);
      return {
        root,
        osdServer,
        coreStart,
        stop: async () => await root.shutdown()
      };
    }
  };
}