"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBundlesRoute = createBundlesRoute;

var _path = require("path");

var UiSharedDeps = _interopRequireWildcard(require("@osd/ui-shared-deps"));

var _dynamic_asset_response = require("./dynamic_asset_response");

var _file_hash_cache = require("./file_hash_cache");

var _np_ui_plugin_public_dirs = require("../np_ui_plugin_public_dirs");

var _utils = require("../../core/server/utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

/**
 *  Creates the routes that serves files from `bundlesPath`.
 *
 *  @param {Object} options
 *  @property {Array<{id,path}>} options.npUiPluginPublicDirs array of ids and paths that should be served for new platform plugins
 *  @property {string} options.regularBundlesPath
 *  @property {string} options.basePublicPath
 *
 *  @return Array.of({Hapi.Route})
 */
function createBundlesRoute({
  basePublicPath,
  npUiPluginPublicDirs = [],
  buildHash,
  isDist = false
}) {
  // rather than calculate the fileHash on every request, we
  // provide a cache object to `resolveDynamicAssetResponse()` that
  // will store the 100 most recently used hashes.
  const fileHashCache = new _file_hash_cache.FileHashCache();
  (0, _np_ui_plugin_public_dirs.assertIsNpUiPluginPublicDirs)(npUiPluginPublicDirs);

  if (typeof basePublicPath !== 'string') {
    throw new TypeError('basePublicPath must be a string');
  }

  if (!basePublicPath.match(/(^$|^\/.*[^\/]$)/)) {
    throw new TypeError('basePublicPath must be empty OR start and not end with a /');
  }

  return [buildRouteForBundles({
    publicPath: `${basePublicPath}/${buildHash}/bundles/osd-ui-shared-deps/`,
    routePath: `/${buildHash}/bundles/osd-ui-shared-deps/`,
    bundlesPath: UiSharedDeps.distDir,
    fileHashCache,
    isDist
  }), ...npUiPluginPublicDirs.map(({
    id,
    path
  }) => buildRouteForBundles({
    publicPath: `${basePublicPath}/${buildHash}/bundles/plugin/${id}/`,
    routePath: `/${buildHash}/bundles/plugin/${id}/`,
    bundlesPath: path,
    fileHashCache,
    isDist
  })), buildRouteForBundles({
    publicPath: `${basePublicPath}/${buildHash}/bundles/core/`,
    routePath: `/${buildHash}/bundles/core/`,
    bundlesPath: (0, _utils.fromRoot)((0, _path.join)('src', 'core', 'target', 'public')),
    fileHashCache,
    isDist
  })];
}

function buildRouteForBundles({
  publicPath,
  routePath,
  bundlesPath,
  fileHashCache,
  isDist
}) {
  return {
    method: 'GET',
    path: `${routePath}{path*}`,
    config: {
      auth: false,
      ext: {
        onPreHandler: {
          method(request, h) {
            const ext = (0, _path.extname)(request.params.path);

            if (ext !== '.js' && ext !== '.css') {
              return h.continue;
            }

            return (0, _dynamic_asset_response.createDynamicAssetResponse)({
              request,
              h,
              bundlesPath,
              fileHashCache,
              publicPath,
              isDist
            });
          }

        }
      }
    },
    handler: {
      directory: {
        path: bundlesPath,
        listing: false,
        lookupCompressed: true
      }
    }
  };
}