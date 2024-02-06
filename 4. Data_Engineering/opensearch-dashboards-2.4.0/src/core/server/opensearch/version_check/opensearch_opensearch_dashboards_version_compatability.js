"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.opensearchVersionCompatibleWithOpenSearchDashboards = opensearchVersionCompatibleWithOpenSearchDashboards;
exports.opensearchVersionEqualsOpenSearchDashboards = opensearchVersionEqualsOpenSearchDashboards;

var _semver = _interopRequireWildcard(require("semver"));

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
 * @private
 *
 * List of OpenSearch Dashboards major versions that can connect to legacy version
 * 7.10.2.
 *
 * WARNING: OpenSearchDashboards 7.x could cause conflicts.
 */
const osdLegacyCompatibleMajorVersions = [1, 2];
/**
 * Checks for the compatibilitiy between OpenSearch and OpenSearchDashboards versions
 * 1. Major version differences will never work together.
 * 2. Older versions of OpenSearch won't work with newer versions of OpenSearch Dashboards.
 */

function opensearchVersionCompatibleWithOpenSearchDashboards(opensearchVersion, opensearchDashboardsVersion) {
  const opensearchVersionNumbers = {
    major: _semver.default.major(opensearchVersion),
    minor: _semver.default.minor(opensearchVersion),
    patch: _semver.default.patch(opensearchVersion)
  };
  const opensearchDashboardsVersionNumbers = {
    major: _semver.default.major(opensearchDashboardsVersion),
    minor: _semver.default.minor(opensearchDashboardsVersion),
    patch: _semver.default.patch(opensearchDashboardsVersion)
  };

  if (legacyVersionCompatibleWithOpenSearchDashboards(opensearchVersionNumbers, opensearchDashboardsVersionNumbers)) {
    return true;
  } // Reject mismatching major version numbers.


  if (opensearchVersionNumbers.major !== opensearchDashboardsVersionNumbers.major) {
    return false;
  } // Reject older minor versions of OpenSearch.


  if (opensearchVersionNumbers.minor < opensearchDashboardsVersionNumbers.minor) {
    return false;
  }

  return true;
}

function opensearchVersionEqualsOpenSearchDashboards(nodeVersion, opensearchDashboardsVersion) {
  const nodeSemVer = (0, _semver.coerce)(nodeVersion);
  const opensearchDashboardsSemver = (0, _semver.coerce)(opensearchDashboardsVersion);
  return nodeSemVer && opensearchDashboardsSemver && nodeSemVer.version === opensearchDashboardsSemver.version;
}
/**
 * Verify legacy version of engines is compatible with current version
 * of OpenSearch Dashboards if OpenSearch Dashboards is 1.x.
 *
 * @private
 * @param legacyVersionNumbers semantic version of legacy engine
 * @param opensearchDashboardsVersionNumbers semantic version of application
 * @returns {boolean}
 */


function legacyVersionCompatibleWithOpenSearchDashboards(legacyVersionNumbers, opensearchDashboardsVersionNumbers) {
  return legacyVersionNumbers.major === 7 && legacyVersionNumbers.minor === 10 && legacyVersionNumbers.patch === 2 && osdLegacyCompatibleMajorVersions.includes(opensearchDashboardsVersionNumbers.major);
}