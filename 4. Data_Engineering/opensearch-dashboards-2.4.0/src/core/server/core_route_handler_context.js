"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreRouteHandlerContext = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _client = /*#__PURE__*/new WeakMap();

var _legacy = /*#__PURE__*/new WeakMap();

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
// eslint-disable-next-line max-classes-per-file
class CoreOpenSearchRouteHandlerContext {
  constructor(opensearchStart, request) {
    this.opensearchStart = opensearchStart;
    this.request = request;

    _classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _legacy, {
      writable: true,
      value: void 0
    });
  }

  get client() {
    if (_classPrivateFieldGet(this, _client) == null) {
      _classPrivateFieldSet(this, _client, this.opensearchStart.client.asScoped(this.request));
    }

    return _classPrivateFieldGet(this, _client);
  }

  get legacy() {
    if (_classPrivateFieldGet(this, _legacy) == null) {
      _classPrivateFieldSet(this, _legacy, {
        client: this.opensearchStart.legacy.client.asScoped(this.request)
      });
    }

    return _classPrivateFieldGet(this, _legacy);
  }

}

var _scopedSavedObjectsClient = /*#__PURE__*/new WeakMap();

var _typeRegistry = /*#__PURE__*/new WeakMap();

class CoreSavedObjectsRouteHandlerContext {
  constructor(savedObjectsStart, request) {
    this.savedObjectsStart = savedObjectsStart;
    this.request = request;

    _classPrivateFieldInitSpec(this, _scopedSavedObjectsClient, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _typeRegistry, {
      writable: true,
      value: void 0
    });
  }

  get client() {
    if (_classPrivateFieldGet(this, _scopedSavedObjectsClient) == null) {
      _classPrivateFieldSet(this, _scopedSavedObjectsClient, this.savedObjectsStart.getScopedClient(this.request));
    }

    return _classPrivateFieldGet(this, _scopedSavedObjectsClient);
  }

  get typeRegistry() {
    if (_classPrivateFieldGet(this, _typeRegistry) == null) {
      _classPrivateFieldSet(this, _typeRegistry, this.savedObjectsStart.getTypeRegistry());
    }

    return _classPrivateFieldGet(this, _typeRegistry);
  }

}

var _client2 = /*#__PURE__*/new WeakMap();

class CoreUiSettingsRouteHandlerContext {
  constructor(uiSettingsStart, savedObjectsRouterHandlerContext) {
    this.uiSettingsStart = uiSettingsStart;
    this.savedObjectsRouterHandlerContext = savedObjectsRouterHandlerContext;

    _classPrivateFieldInitSpec(this, _client2, {
      writable: true,
      value: void 0
    });
  }

  get client() {
    if (_classPrivateFieldGet(this, _client2) == null) {
      _classPrivateFieldSet(this, _client2, this.uiSettingsStart.asScopedToClient(this.savedObjectsRouterHandlerContext.client));
    }

    return _classPrivateFieldGet(this, _client2);
  }

}

var _auditor = /*#__PURE__*/new WeakMap();

class CoreRouteHandlerContext {
  constructor(coreStart, request) {
    this.coreStart = coreStart;
    this.request = request;

    _classPrivateFieldInitSpec(this, _auditor, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "opensearch", void 0);

    _defineProperty(this, "savedObjects", void 0);

    _defineProperty(this, "uiSettings", void 0);

    this.opensearch = new CoreOpenSearchRouteHandlerContext(this.coreStart.opensearch, this.request);
    this.savedObjects = new CoreSavedObjectsRouteHandlerContext(this.coreStart.savedObjects, this.request);
    this.uiSettings = new CoreUiSettingsRouteHandlerContext(this.coreStart.uiSettings, this.savedObjects);
  }

  get auditor() {
    if (_classPrivateFieldGet(this, _auditor) == null) {
      _classPrivateFieldSet(this, _auditor, this.coreStart.auditTrail.asScoped(this.request));
    }

    return _classPrivateFieldGet(this, _auditor);
  }

}

exports.CoreRouteHandlerContext = CoreRouteHandlerContext;