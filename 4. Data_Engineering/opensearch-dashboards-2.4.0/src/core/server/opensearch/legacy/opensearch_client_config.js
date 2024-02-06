"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOpenSearchClientConfig = parseOpenSearchClientConfig;

var _lodash = require("lodash");

var _url = _interopRequireDefault(require("url"));

var _std = require("@osd/std");

var _default_headers = require("../default_headers");

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

/** @internal */
function parseOpenSearchClientConfig(config, log, {
  ignoreCertAndKey = false,
  auth = true
} = {}) {
  const opensearchClientConfig = {
    keepAlive: true,
    ...(0, _std.pick)(config, ['apiVersion', 'sniffOnStart', 'sniffOnConnectionFault', 'keepAlive', 'log', 'plugins'])
  };

  if (opensearchClientConfig.log == null) {
    opensearchClientConfig.log = getLoggerClass(log, config.logQueries);
  }

  if (config.pingTimeout != null) {
    opensearchClientConfig.pingTimeout = getDurationAsMs(config.pingTimeout);
  }

  if (config.requestTimeout != null) {
    opensearchClientConfig.requestTimeout = getDurationAsMs(config.requestTimeout);
  }

  if (config.sniffInterval) {
    opensearchClientConfig.sniffInterval = getDurationAsMs(config.sniffInterval);
  }

  if (Array.isArray(config.hosts)) {
    const needsAuth = auth !== false && config.username && config.password;
    opensearchClientConfig.hosts = config.hosts.map(nodeUrl => {
      const uri = _url.default.parse(nodeUrl);

      const httpsURI = uri.protocol === 'https:';
      const httpURI = uri.protocol === 'http:';
      const host = {
        host: uri.hostname,
        port: uri.port || httpsURI && '443' || httpURI && '80',
        protocol: uri.protocol,
        path: uri.pathname,
        query: uri.query,
        headers: { ..._default_headers.DEFAULT_HEADERS,
          ...config.customHeaders
        }
      };

      if (needsAuth) {
        host.auth = `${config.username}:${config.password}`;
      }

      return host;
    });
  }

  if (config.ssl === undefined) {
    return (0, _lodash.cloneDeep)(opensearchClientConfig);
  }

  opensearchClientConfig.ssl = {};
  const verificationMode = config.ssl.verificationMode;

  switch (verificationMode) {
    case 'none':
      opensearchClientConfig.ssl.rejectUnauthorized = false;
      break;

    case 'certificate':
      opensearchClientConfig.ssl.rejectUnauthorized = true; // by default, NodeJS is checking the server identify

      opensearchClientConfig.ssl.checkServerIdentity = () => undefined;

      break;

    case 'full':
      opensearchClientConfig.ssl.rejectUnauthorized = true;
      break;

    default:
      throw new Error(`Unknown ssl verificationMode: ${verificationMode}`);
  }

  opensearchClientConfig.ssl.ca = config.ssl.certificateAuthorities; // Add client certificate and key if required by opensearch

  if (!ignoreCertAndKey && config.ssl.certificate && config.ssl.key) {
    opensearchClientConfig.ssl.cert = config.ssl.certificate;
    opensearchClientConfig.ssl.key = config.ssl.key;
    opensearchClientConfig.ssl.passphrase = config.ssl.keyPassphrase;
  } // OpenSearch JS client mutates config object, so all properties that are
  // usually passed by reference should be cloned to avoid any side effects.


  return (0, _lodash.cloneDeep)(opensearchClientConfig);
}

function getDurationAsMs(duration) {
  if (typeof duration === 'number') {
    return duration;
  }

  return duration.asMilliseconds();
}

function getLoggerClass(log, logQueries = false) {
  return class OpenSearchClientLogging {
    error(err) {
      log.error(err);
    }

    warning(message) {
      log.warn(message);
    }

    trace(method, options, query, _, statusCode) {
      if (logQueries) {
        log.debug(`${statusCode}\n${method} ${options.path}\n${query ? query.trim() : ''}`, {
          tags: ['query']
        });
      }
    } // elasticsearch-js expects the following functions to exist


    info() {// noop
    }

    debug() {// noop
    }

    close() {// noop
    }

  };
}