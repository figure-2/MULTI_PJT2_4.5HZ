"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optimizeMixin = void 0;

var _bundles_route = require("./bundles_route");

var _np_ui_plugin_public_dirs = require("./np_ui_plugin_public_dirs");

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
const optimizeMixin = async (osdServer, server, config) => {
  server.route((0, _bundles_route.createBundlesRoute)({
    basePublicPath: config.get('server.basePath'),
    npUiPluginPublicDirs: (0, _np_ui_plugin_public_dirs.getNpUiPluginPublicDirs)(osdServer),
    buildHash: osdServer.newPlatform.env.packageInfo.buildNum.toString(),
    isDist: osdServer.newPlatform.env.packageInfo.dist
  }));
};

exports.optimizeMixin = optimizeMixin;