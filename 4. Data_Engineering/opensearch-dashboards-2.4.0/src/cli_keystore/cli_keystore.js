"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../core/server/utils");

var _command = _interopRequireDefault(require("../cli/command"));

var _keystore = require("../legacy/server/keystore");

var _create = require("./create");

var _list = require("./list");

var _add = require("./add");

var _remove = require("./remove");

var _get_keystore = require("./get_keystore");

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
const argv = process.env.osdWorkerArgv ? JSON.parse(process.env.osdWorkerArgv) : process.argv.slice();
const program = new _command.default('bin/opensearch-dashboards-keystore');
program.version(_utils.pkg.version).description('A tool for managing settings stored in the OpenSearch Dashboards keystore');
const keystore = new _keystore.Keystore((0, _get_keystore.getKeystore)());
(0, _create.createCli)(program, keystore);
(0, _list.listCli)(program, keystore);
(0, _add.addCli)(program, keystore);
(0, _remove.removeCli)(program, keystore);
program.command('help <command>').description('get the help for a specific command').action(function (cmdName) {
  const cmd = _lodash.default.find(program.commands, {
    _name: cmdName
  });

  if (!cmd) return program.error(`unknown command ${cmdName}`);
  cmd.help();
});
program.command('*', null, {
  noHelp: true
}).action(function (cmd) {
  program.error(`unknown command ${cmd}`);
}); // check for no command name

const subCommand = argv[2] && !String(argv[2][0]).match(/^-|^\.|\//);

if (!subCommand) {
  program.defaultHelp();
}

program.parse(process.argv);