"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkOriginConflicts = checkOriginConflicts;
exports.getImportIdMapForRetries = getImportIdMapForRetries;

var _pMap = _interopRequireDefault(require("p-map"));

var _uuid = require("uuid");

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
const isLeft = object => object.tag === 'left';

const MAX_CONCURRENT_SEARCHES = 10;

const createQueryTerm = input => input.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');

const createQuery = (type, id, rawIdPrefix) => `"${createQueryTerm(`${rawIdPrefix}${type}:${id}`)}" | "${createQueryTerm(id)}"`;

const transformObjectsToAmbiguousConflictFields = objects => objects.map(({
  id,
  attributes,
  updated_at: updatedAt
}) => ({
  id,
  title: attributes === null || attributes === void 0 ? void 0 : attributes.title,
  updatedAt
}));

const getAmbiguousConflictSourceKey = ({
  object
}) => `${object.type}:${object.originId || object.id}`;
/**
 * Make a search request for an import object to check if any objects of this type that match this object's `originId` or `id` exist in the
 * specified namespace:
 *  - A `Right` result indicates that no conflict destinations were found in this namespace ("no match").
 *  - A `Left` result indicates that one or more conflict destinations exist in this namespace, none of which exactly match this object's ID
 *    ("inexact match"). We can make this assumption because any "exact match" results would have been obtained and filtered out by the
 *    `checkConflicts` submodule, which is called before this.
 */


const checkOriginConflict = async params => {
  const {
    object,
    savedObjectsClient,
    typeRegistry,
    namespace,
    importIdMap
  } = params;
  const importIds = new Set(importIdMap.keys());
  const {
    type,
    originId
  } = object;

  if (!typeRegistry.isMultiNamespace(type)) {
    // Skip the search request for non-multi-namespace types, since by definition they cannot have inexact matches or ambiguous conflicts.
    return {
      tag: 'right',
      value: object
    };
  }

  const search = createQuery(type, originId || object.id, namespace ? `${namespace}:` : '');
  const findOptions = {
    type,
    search,
    rootSearchFields: ['_id', 'originId'],
    page: 1,
    perPage: 10,
    fields: ['title'],
    sortField: 'updated_at',
    sortOrder: 'desc',
    ...(namespace && {
      namespaces: [namespace]
    })
  };
  const findResult = await savedObjectsClient.find(findOptions);
  const {
    total,
    saved_objects: savedObjects
  } = findResult;

  if (total === 0) {
    return {
      tag: 'right',
      value: object
    };
  } // This is an "inexact match" so far; filter the conflict destination(s) to exclude any that exactly match other objects we are importing.


  const objects = savedObjects.filter(obj => !importIds.has(`${obj.type}:${obj.id}`));
  const destinations = transformObjectsToAmbiguousConflictFields(objects);

  if (destinations.length === 0) {
    // No conflict destinations remain after filtering, so this is a "no match" result.
    return {
      tag: 'right',
      value: object
    };
  }

  return {
    tag: 'left',
    value: {
      object,
      destinations
    }
  };
};
/**
 * This function takes all objects to import, and checks "multi-namespace" types for potential conflicts. An object with a multi-namespace
 * type may include an `originId` field, which means that it should conflict with other objects that originate from the same source.
 * Expected behavior of importing saved objects (single-namespace or multi-namespace):
 *  1. The object 'foo' is exported from space A and imported to space B -- a new object 'bar' is created.
 *  2. Then, the object 'bar' is exported from space B and imported to space C -- a new object 'baz' is created.
 *  3. Then, the object 'baz' is exported from space C to space A -- the object conflicts with 'foo', which must be overwritten to continue.
 * This behavior originated with "single-namespace" types, and this function was added to ensure importing objects of multi-namespace types
 * will behave in the same way.
 *
 * To achieve this behavior for multi-namespace types, a search request is made for each object to determine if any objects of this type
 * that match this object's `originId` or `id` exist in the specified namespace:
 *  - If this is a `Right` result; return the import object and allow `createSavedObjects` to handle the conflict (if any).
 *  - If this is a `Left` "partial match" result:
 *     A. If there is a single source and destination match, add the destination to the importIdMap and return the import object, which
 *        will allow `createSavedObjects` to modify the ID before creating the object (thus ensuring a conflict during).
 *     B. Otherwise, this is an "ambiguous conflict" result; return an error.
 */


async function checkOriginConflicts({
  objects,
  ...params
}) {
  // Check each object for possible destination conflicts, ensuring we don't too many concurrent searches running.
  const mapper = async object => checkOriginConflict({
    object,
    ...params
  });

  const checkOriginConflictResults = await (0, _pMap.default)(objects, mapper, {
    concurrency: MAX_CONCURRENT_SEARCHES
  }); // Get a map of all inexact matches that share the same destination(s).

  const ambiguousConflictSourcesMap = checkOriginConflictResults.filter(isLeft).reduce((acc, cur) => {
    var _acc$get;

    const key = getAmbiguousConflictSourceKey(cur.value);
    const value = (_acc$get = acc.get(key)) !== null && _acc$get !== void 0 ? _acc$get : [];
    return acc.set(key, [...value, cur.value.object]);
  }, new Map());
  const errors = [];
  const importIdMap = new Map();
  const pendingOverwrites = new Set();
  checkOriginConflictResults.forEach(result => {
    if (!isLeft(result)) {
      return;
    }

    const key = getAmbiguousConflictSourceKey(result.value);
    const sources = transformObjectsToAmbiguousConflictFields(ambiguousConflictSourcesMap.get(key));
    const {
      object,
      destinations
    } = result.value;
    const {
      type,
      id,
      attributes
    } = object;

    if (sources.length === 1 && destinations.length === 1) {
      // This is a simple "inexact match" result -- a single import object has a single destination conflict.
      if (params.ignoreRegularConflicts) {
        importIdMap.set(`${type}:${id}`, {
          id: destinations[0].id
        });
        pendingOverwrites.add(`${type}:${id}`);
      } else {
        const {
          title
        } = attributes;
        errors.push({
          type,
          id,
          title,
          meta: {
            title
          },
          error: {
            type: 'conflict',
            destinationId: destinations[0].id
          }
        });
      }

      return;
    } // This is an ambiguous conflict error, which is one of the following cases:
    //  - a single import object has 2+ destination conflicts ("ambiguous destination")
    //  - 2+ import objects have the same single destination conflict ("ambiguous source")
    //  - 2+ import objects have the same 2+ destination conflicts ("ambiguous source and destination")


    if (sources.length > 1) {
      // In the case of ambiguous source conflicts, don't treat them as errors; instead, regenerate the object ID and reset its origin
      // (e.g., the same outcome as if `createNewCopies` was enabled for the entire import operation).
      importIdMap.set(`${type}:${id}`, {
        id: (0, _uuid.v4)(),
        omitOriginId: true
      });
      return;
    }

    const {
      title
    } = attributes;
    errors.push({
      type,
      id,
      title,
      meta: {
        title
      },
      error: {
        type: 'ambiguous_conflict',
        destinations
      }
    });
  });
  return {
    errors,
    importIdMap,
    pendingOverwrites
  };
}
/**
 * Assume that all objects exist in the `retries` map (due to filtering at the beginning of `resolveSavedObjectsImportErrors`).
 */


function getImportIdMapForRetries(params) {
  const {
    objects,
    retries,
    createNewCopies
  } = params;
  const retryMap = retries.reduce((acc, cur) => acc.set(`${cur.type}:${cur.id}`, cur), new Map());
  const importIdMap = new Map();
  objects.forEach(({
    type,
    id
  }) => {
    const retry = retryMap.get(`${type}:${id}`);

    if (!retry) {
      throw new Error(`Retry was expected for "${type}:${id}" but not found`);
    }

    const {
      destinationId
    } = retry;
    const omitOriginId = createNewCopies || Boolean(retry.createNewCopy);

    if (destinationId && destinationId !== id) {
      importIdMap.set(`${type}:${id}`, {
        id: destinationId,
        omitOriginId
      });
    }
  });
  return importIdMap;
}