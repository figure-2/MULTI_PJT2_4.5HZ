"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _http = require("../public/http");

var _fatal_errors_service = require("../public/fatal_errors/fatal_errors_service.mock");

var _injected_metadata_service = require("../public/injected_metadata/injected_metadata_service.mock");

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
const defaultTap = injectedMetadata => {
  injectedMetadata.getBasePath.mockReturnValue('http://localhost/myBase');
};

function setup(tap = defaultTap) {
  const injectedMetadata = _injected_metadata_service.injectedMetadataServiceMock.createSetupContract();

  const fatalErrors = _fatal_errors_service.fatalErrorsServiceMock.createSetupContract();

  tap(injectedMetadata, fatalErrors);
  const httpService = new _http.HttpService();
  const http = httpService.setup({
    fatalErrors,
    injectedMetadata
  });
  return {
    httpService,
    injectedMetadata,
    fatalErrors,
    http
  };
}