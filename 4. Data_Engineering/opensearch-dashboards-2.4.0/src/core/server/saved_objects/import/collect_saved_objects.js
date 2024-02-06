"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectSavedObjects = collectSavedObjects;

var _streams = require("../../utils/streams");

var _create_limit_stream = require("./create_limit_stream");

var _get_non_unique_entries = require("./get_non_unique_entries");

var _ = require("..");

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
async function collectSavedObjects({
  readStream,
  objectLimit,
  filter,
  supportedTypes
}) {
  const errors = [];
  const entries = [];
  const importIdMap = new Map();
  const collectedObjects = await (0, _streams.createPromiseFromStreams)([readStream, (0, _create_limit_stream.createLimitStream)(objectLimit), (0, _streams.createFilterStream)(obj => {
    entries.push({
      type: obj.type,
      id: obj.id
    });

    if (supportedTypes.includes(obj.type)) {
      return true;
    }

    const {
      title
    } = obj.attributes;
    errors.push({
      id: obj.id,
      type: obj.type,
      title,
      meta: {
        title
      },
      error: {
        type: 'unsupported_type'
      }
    });
    return false;
  }), (0, _streams.createFilterStream)(obj => filter ? filter(obj) : true), (0, _streams.createMapStream)(obj => {
    importIdMap.set(`${obj.type}:${obj.id}`, {}); // Ensure migrations execute on every saved object

    return Object.assign({
      migrationVersion: {}
    }, obj);
  }), (0, _streams.createConcatStream)([])]); // throw a BadRequest error if we see the same import object type/id more than once

  const nonUniqueEntries = (0, _get_non_unique_entries.getNonUniqueEntries)(entries);

  if (nonUniqueEntries.length > 0) {
    throw _.SavedObjectsErrorHelpers.createBadRequestError(`Non-unique import objects detected: [${nonUniqueEntries.join()}]`);
  }

  return {
    errors,
    collectedObjects,
    importIdMap
  };
}