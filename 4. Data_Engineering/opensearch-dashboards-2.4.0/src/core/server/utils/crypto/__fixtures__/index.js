"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TWO_KEYS_PATH = exports.TWO_CAS_PATH = exports.NO_KEY_PATH = exports.NO_CERT_PATH = exports.NO_CA_PATH = void 0;

var _path = require("path");

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
const NO_CA_PATH = (0, _path.resolve)(__dirname, './no_ca.p12');
exports.NO_CA_PATH = NO_CA_PATH;
const NO_CERT_PATH = (0, _path.resolve)(__dirname, './no_cert.p12');
exports.NO_CERT_PATH = NO_CERT_PATH;
const NO_KEY_PATH = (0, _path.resolve)(__dirname, './no_key.p12');
exports.NO_KEY_PATH = NO_KEY_PATH;
const TWO_CAS_PATH = (0, _path.resolve)(__dirname, './two_cas.p12');
exports.TWO_CAS_PATH = TWO_CAS_PATH;
const TWO_KEYS_PATH = (0, _path.resolve)(__dirname, './two_keys.p12');
exports.TWO_KEYS_PATH = TWO_KEYS_PATH;