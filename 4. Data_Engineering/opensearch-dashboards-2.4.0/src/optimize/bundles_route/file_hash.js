"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileHash = getFileHash;

var _crypto = require("crypto");

var _fs = _interopRequireDefault(require("fs"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

/**
 *  Get the hash of a file via a file descriptor
 */
async function getFileHash(cache, path, stat, fd) {
  const key = `${path}:${stat.ino}:${stat.size}:${stat.mtime.getTime()}`;
  const cached = cache.get(key);

  if (cached) {
    return await cached;
  }

  const hash = (0, _crypto.createHash)('sha1');

  const read = _fs.default.createReadStream(null, {
    fd,
    start: 0,
    autoClose: false
  });

  const promise = Rx.merge(Rx.fromEvent(read, 'data'), Rx.fromEvent(read, 'error').pipe((0, _operators.map)(error => {
    throw error;
  }))).pipe((0, _operators.takeUntil)(Rx.fromEvent(read, 'end'))).forEach(chunk => hash.update(chunk)).then(() => hash.digest('hex')).catch(error => {
    // don't cache failed attempts
    cache.del(key);
    throw error;
  });
  cache.set(key, promise);
  return await promise;
}