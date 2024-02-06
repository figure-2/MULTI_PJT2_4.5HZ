"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LegacyClusterClient: true,
  ILegacyClusterClient: true,
  ILegacyCustomClusterClient: true,
  ILegacyScopedClusterClient: true,
  LegacyScopedClusterClient: true,
  LegacyOpenSearchClientConfig: true,
  LegacyOpenSearchError: true,
  LegacyOpenSearchErrorHelpers: true
};
Object.defineProperty(exports, "ILegacyClusterClient", {
  enumerable: true,
  get: function () {
    return _cluster_client.ILegacyClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyCustomClusterClient", {
  enumerable: true,
  get: function () {
    return _cluster_client.ILegacyCustomClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _scoped_cluster_client.ILegacyScopedClusterClient;
  }
});
Object.defineProperty(exports, "LegacyClusterClient", {
  enumerable: true,
  get: function () {
    return _cluster_client.LegacyClusterClient;
  }
});
Object.defineProperty(exports, "LegacyOpenSearchClientConfig", {
  enumerable: true,
  get: function () {
    return _opensearch_client_config.LegacyOpenSearchClientConfig;
  }
});
Object.defineProperty(exports, "LegacyOpenSearchError", {
  enumerable: true,
  get: function () {
    return _errors.LegacyOpenSearchError;
  }
});
Object.defineProperty(exports, "LegacyOpenSearchErrorHelpers", {
  enumerable: true,
  get: function () {
    return _errors.LegacyOpenSearchErrorHelpers;
  }
});
Object.defineProperty(exports, "LegacyScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _scoped_cluster_client.LegacyScopedClusterClient;
  }
});

var _cluster_client = require("./cluster_client");

var _scoped_cluster_client = require("./scoped_cluster_client");

var _opensearch_client_config = require("./opensearch_client_config");

var _errors = require("./errors");

var _api_types = require("./api_types");

Object.keys(_api_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _api_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api_types[key];
    }
  });
});