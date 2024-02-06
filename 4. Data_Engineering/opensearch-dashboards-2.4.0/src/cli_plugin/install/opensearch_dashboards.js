"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertVersion = assertVersion;
exports.existingInstall = existingInstall;

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _version = require("../../legacy/utils/version");

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
function existingInstall(settings, logger) {
  try {
    (0, _fs.statSync)(_path.default.join(settings.pluginDir, settings.plugins[0].id));
    logger.error(`Plugin ${settings.plugins[0].id} already exists, please remove before installing a new version`);
    process.exit(70);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

function assertVersion(settings) {
  if (!settings.plugins[0].opensearchDashboardsVersion) {
    throw new Error(`Plugin opensearch_dashboards.json is missing both a version property (required) and a opensearchDashboardsVersion property (optional).`);
  }

  const actual = (0, _version.cleanVersion)(settings.plugins[0].opensearchDashboardsVersion);
  const expected = (0, _version.cleanVersion)(settings.version);

  if (!(0, _version.versionSatisfies)(actual, expected)) {
    throw new Error(`Plugin ${settings.plugins[0].id} [${actual}] is incompatible with OpenSearch Dashboards [${expected}]`);
  }
}