"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installCommand = installCommand;

var _utils = require("@osd/utils");

var _utils2 = require("../../core/server/utils");

var _install = require("./install");

var _logger = require("../lib/logger");

var _settings = require("./settings");

var _log_warnings = require("../lib/log_warnings");

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
function processCommand(command, options) {
  let settings;

  try {
    settings = (0, _settings.parse)(command, options, _utils2.pkg);
  } catch (ex) {
    //The logger has not yet been initialized.
    console.error(ex.message);
    process.exit(64);
  }

  const logger = new _logger.Logger(settings);
  (0, _log_warnings.logWarnings)(settings, logger);
  (0, _install.install)(settings, logger);
}

function installCommand(program) {
  program.command('install <plugin/url>').option('-q, --quiet', 'disable all process messaging except errors').option('-s, --silent', 'disable all process messaging').option('-c, --config <path>', 'path to the config file', (0, _utils.getConfigPath)()).option('-t, --timeout <duration>', 'length of time before failing; 0 for never fail', _settings.parseMilliseconds).description('install a plugin', `Common examples:
  install file:///Path/to/my/plugin-example.zip
  install https://path.to/my/plugin-example.zip`).action(processCommand);
}