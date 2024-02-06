"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportSavedObjectsToStream = exportSavedObjectsToStream;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _streams = require("../../utils/streams");

var _inject_nested_depdendencies = require("./inject_nested_depdendencies");

var _sort_objects = require("./sort_objects");

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
async function fetchObjectsToExport({
  objects,
  types,
  search,
  exportSizeLimit,
  savedObjectsClient,
  namespace
}) {
  var _types$length, _objects$length;

  if (((_types$length = types === null || types === void 0 ? void 0 : types.length) !== null && _types$length !== void 0 ? _types$length : 0) > 0 && ((_objects$length = objects === null || objects === void 0 ? void 0 : objects.length) !== null && _objects$length !== void 0 ? _objects$length : 0) > 0) {
    throw _boom.default.badRequest(`Can't specify both "types" and "objects" properties when exporting`);
  }

  if (objects && objects.length > 0) {
    if (objects.length > exportSizeLimit) {
      throw _boom.default.badRequest(`Can't export more than ${exportSizeLimit} objects`);
    }

    if (typeof search === 'string') {
      throw _boom.default.badRequest(`Can't specify both "search" and "objects" properties when exporting`);
    }

    const bulkGetResult = await savedObjectsClient.bulkGet(objects, {
      namespace
    });
    const erroredObjects = bulkGetResult.saved_objects.filter(obj => !!obj.error);

    if (erroredObjects.length) {
      const err = _boom.default.badRequest();

      err.output.payload.attributes = {
        objects: erroredObjects
      };
      throw err;
    }

    return bulkGetResult.saved_objects;
  } else if (types && types.length > 0) {
    const findResponse = await savedObjectsClient.find({
      type: types,
      search,
      perPage: exportSizeLimit,
      namespaces: namespace ? [namespace] : undefined
    });

    if (findResponse.total > exportSizeLimit) {
      throw _boom.default.badRequest(`Can't export more than ${exportSizeLimit} objects`);
    } // sorts server-side by _id, since it's only available in fielddata


    return findResponse.saved_objects // exclude the find-specific `score` property from the exported objects
    .map(({
      score,
      ...obj
    }) => obj).sort((a, b) => a.id > b.id ? 1 : -1);
  } else {
    throw _boom.default.badRequest('Either `type` or `objects` are required.');
  }
}
/**
 * Generates sorted saved object stream to be used for export.
 * See the {@link SavedObjectsExportOptions | options} for more detailed information.
 *
 * @public
 */


async function exportSavedObjectsToStream({
  types,
  objects,
  search,
  savedObjectsClient,
  exportSizeLimit,
  includeReferencesDeep = false,
  excludeExportDetails = false,
  namespace
}) {
  const rootObjects = await fetchObjectsToExport({
    types,
    objects,
    search,
    savedObjectsClient,
    exportSizeLimit,
    namespace
  });
  let exportedObjects = [];
  let missingReferences = [];

  if (includeReferencesDeep) {
    const fetchResult = await (0, _inject_nested_depdendencies.fetchNestedDependencies)(rootObjects, savedObjectsClient, namespace);
    exportedObjects = (0, _sort_objects.sortObjects)(fetchResult.objects);
    missingReferences = fetchResult.missingRefs;
  } else {
    exportedObjects = (0, _sort_objects.sortObjects)(rootObjects);
  } // redact attributes that should not be exported


  const redactedObjects = exportedObjects.map(({
    namespaces,
    ...object
  }) => object);
  const exportDetails = {
    exportedCount: exportedObjects.length,
    missingRefCount: missingReferences.length,
    missingReferences
  };
  return (0, _streams.createListStream)([...redactedObjects, ...(excludeExportDetails ? [] : [exportDetails])]);
}