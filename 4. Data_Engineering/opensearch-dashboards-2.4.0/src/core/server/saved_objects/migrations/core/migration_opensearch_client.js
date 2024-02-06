"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMigrationOpenSearchClient = createMigrationOpenSearchClient;

var _lodash = require("lodash");

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _retry_call_cluster = require("../../../opensearch/client/retry_call_cluster");

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
const methods = ['bulk', 'cat.templates', 'clearScroll', 'count', 'indices.create', 'indices.delete', 'indices.deleteTemplate', 'indices.get', 'indices.getAlias', 'indices.refresh', 'indices.updateAliases', 'reindex', 'search', 'scroll', 'tasks.get'];

function createMigrationOpenSearchClient(client, log, delay) {
  return methods.reduce((acc, key) => {
    (0, _saferLodashSet.set)(acc, key, async (params, options) => {
      const fn = (0, _lodash.get)(client, key);

      if (!fn) {
        throw new Error(`unknown OpenSearchClient client method [${key}]`);
      }

      return await (0, _retry_call_cluster.migrationRetryCallCluster)(() => fn.call(client, params, {
        maxRetries: 0,
        ...options
      }), log, delay);
    });
    return acc;
  }, {});
}