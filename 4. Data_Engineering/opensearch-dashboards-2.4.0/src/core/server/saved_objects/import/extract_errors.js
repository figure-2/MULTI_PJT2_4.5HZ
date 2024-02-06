"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractErrors = extractErrors;

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
function extractErrors( // TODO: define saved object type
savedObjectResults, savedObjectsToImport) {
  const errors = [];
  const originalSavedObjectsMap = new Map();

  for (const savedObject of savedObjectsToImport) {
    originalSavedObjectsMap.set(`${savedObject.type}:${savedObject.id}`, savedObject);
  }

  for (const savedObject of savedObjectResults) {
    if (savedObject.error) {
      var _originalSavedObject$;

      const originalSavedObject = originalSavedObjectsMap.get(`${savedObject.type}:${savedObject.id}`);
      const title = originalSavedObject === null || originalSavedObject === void 0 ? void 0 : (_originalSavedObject$ = originalSavedObject.attributes) === null || _originalSavedObject$ === void 0 ? void 0 : _originalSavedObject$.title;
      const {
        destinationId
      } = savedObject;

      if (savedObject.error.statusCode === 409) {
        errors.push({
          id: savedObject.id,
          type: savedObject.type,
          title,
          meta: {
            title
          },
          error: {
            type: 'conflict',
            ...(destinationId && {
              destinationId
            })
          }
        });
        continue;
      }

      errors.push({
        id: savedObject.id,
        type: savedObject.type,
        title,
        meta: {
          title
        },
        error: { ...savedObject.error,
          type: 'unknown'
        }
      });
    }
  }

  return errors;
}