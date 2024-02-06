"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PluginOpaqueId: true,
  Branding: true
};
Object.defineProperty(exports, "Branding", {
  enumerable: true,
  get: function () {
    return _types5.Branding;
  }
});
Object.defineProperty(exports, "PluginOpaqueId", {
  enumerable: true,
  get: function () {
    return _types.PluginOpaqueId;
  }
});

var _types = require("./plugins/types");

var _types2 = require("./saved_objects/types");

Object.keys(_types2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types2[key];
    }
  });
});

var _types3 = require("./ui_settings/types");

Object.keys(_types3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types3[key];
    }
  });
});

var _types4 = require("./legacy/types");

Object.keys(_types4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types4[key];
    }
  });
});

var _types5 = require("../../core/types");