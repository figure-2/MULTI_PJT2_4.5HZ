"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Template = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fonts = require("./fonts");

var _styles = require("./styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
const Template = ({
  metadata: {
    uiPublicUrl,
    locale,
    darkMode,
    injectedMetadata,
    i18n,
    bootstrapScriptUrl,
    strictCsp
  }
}) => {
  var _injectedMetadata$bra, _injectedMetadata$bra2, _injectedMetadata$bra3, _injectedMetadata$bra4;

  const openSearchLogo = /*#__PURE__*/_react.default.createElement("svg", {
    width: "64",
    height: "64",
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M61.7374 23.5C60.4878 23.5 59.4748 24.513 59.4748 25.7626C59.4748 44.3813 44.3813 59.4748 25.7626 59.4748C24.513 59.4748 23.5 60.4878 23.5 61.7374C23.5 62.987 24.513 64 25.7626 64C46.8805 64 64 46.8805 64 25.7626C64 24.513 62.987 23.5 61.7374 23.5Z",
    fill: "#005EB8"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M48.0814 38C50.2572 34.4505 52.3615 29.7178 51.9475 23.0921C51.0899 9.36725 38.6589 -1.04463 26.9206 0.0837327C22.3253 0.525465 17.6068 4.2712 18.026 10.9805C18.2082 13.8961 19.6352 15.6169 21.9544 16.9399C24.1618 18.1992 26.9978 18.9969 30.2128 19.9011C34.0962 20.9934 38.6009 22.2203 42.063 24.7717C46.2125 27.8295 49.0491 31.3743 48.0814 38Z",
    fill: "#003B5C"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M3.91861 14C1.74276 17.5495 -0.361506 22.2822 0.0524931 28.9079C0.910072 42.6327 13.3411 53.0446 25.0794 51.9163C29.6747 51.4745 34.3932 47.7288 33.974 41.0195C33.7918 38.1039 32.3647 36.3831 30.0456 35.0601C27.8382 33.8008 25.0022 33.0031 21.7872 32.0989C17.9038 31.0066 13.3991 29.7797 9.93694 27.2283C5.78746 24.1704 2.95092 20.6257 3.91861 14Z",
    fill: "#005EB8"
  }));

  const openSearchLogoSpinner = /*#__PURE__*/_react.default.createElement("svg", {
    viewBox: "0 0 90 90",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("path", {
    d: "M75.7374 37.5C74.4878 37.5 73.4748 38.513 73.4748 39.7626C73.4748 58.3813 58.3813 73.4748 39.7626 73.4748C38.513 73.4748 37.5 74.4878 37.5 75.7374C37.5 76.987 38.513 78 39.7626 78C60.8805 78 78 60.8805 78 39.7626C78 38.513 76.987 37.5 75.7374 37.5Z",
    fill: "#005EB8"
  }), /*#__PURE__*/_react.default.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    from: "0 40 40",
    to: "359.9 40 40",
    dur: "1.5s",
    repeatCount: "indefinite",
    values: "0 40 40; 15 40 40; 340 40 40; 359.9 40 40",
    keyTimes: "0; .3; .7; 1"
  })), /*#__PURE__*/_react.default.createElement("path", {
    d: "M62.0814 52C64.2572 48.4505 66.3615 43.7178 65.9475 37.0921C65.0899 23.3673 52.6589 12.9554 40.9206 14.0837C36.3253 14.5255 31.6068 18.2712 32.026 24.9805C32.2082 27.8961 33.6352 29.6169 35.9544 30.9399C38.1618 32.1992 40.9978 32.9969 44.2128 33.9011C48.0962 34.9934 52.6009 36.2203 56.0631 38.7717C60.2125 41.8296 63.0491 45.3743 62.0814 52Z",
    fill: "#003B5C"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M17.9186 28C15.7428 31.5495 13.6385 36.2822 14.0525 42.9079C14.9101 56.6327 27.3411 67.0446 39.0794 65.9163C43.6747 65.4745 48.3932 61.7288 47.974 55.0195C47.7918 52.1039 46.3647 50.3831 44.0456 49.0601C41.8382 47.8008 39.0022 47.0031 35.7872 46.0989C31.9038 45.0066 27.3991 43.7797 23.9369 41.2283C19.7875 38.1704 16.9509 34.6257 17.9186 28Z",
    fill: "#005EB8"
  }));

  const loadingLogoDefault = (_injectedMetadata$bra = injectedMetadata.branding.loadingLogo) === null || _injectedMetadata$bra === void 0 ? void 0 : _injectedMetadata$bra.defaultUrl;
  const loadingLogoDarkMode = (_injectedMetadata$bra2 = injectedMetadata.branding.loadingLogo) === null || _injectedMetadata$bra2 === void 0 ? void 0 : _injectedMetadata$bra2.darkModeUrl;
  const markDefault = (_injectedMetadata$bra3 = injectedMetadata.branding.mark) === null || _injectedMetadata$bra3 === void 0 ? void 0 : _injectedMetadata$bra3.defaultUrl;
  const markDarkMode = (_injectedMetadata$bra4 = injectedMetadata.branding.mark) === null || _injectedMetadata$bra4 === void 0 ? void 0 : _injectedMetadata$bra4.darkModeUrl;
  const favicon = injectedMetadata.branding.faviconUrl;
  const applicationTitle = injectedMetadata.branding.applicationTitle;
  /**
   * Use branding configurations to check which URL to use for rendering
   * loading logo in default mode. In default mode, loading logo will
   * proritize default loading logo URL, and then default mark URL.
   * If both are invalid, default opensearch logo and spinner will be rendered.
   *
   * @returns a valid custom URL or undefined if no valid URL is provided
   */

  const customLoadingLogoDefaultMode = () => {
    var _ref;

    return (_ref = loadingLogoDefault !== null && loadingLogoDefault !== void 0 ? loadingLogoDefault : markDefault) !== null && _ref !== void 0 ? _ref : undefined;
  };
  /**
   * Use branding configurations to check which URL to use for rendering
   * loading logo in default mode. In dark mode, loading logo will proritize
   * loading logo URLs, then mark logo URLs.
   * Within each type, the dark mode URL will be proritized if provided.
   *
   * @returns a valid custom URL or undefined if no valid URL is provided
   */


  const customLoadingLogoDarkMode = () => {
    var _ref2, _ref3, _ref4;

    return (_ref2 = (_ref3 = (_ref4 = loadingLogoDarkMode !== null && loadingLogoDarkMode !== void 0 ? loadingLogoDarkMode : loadingLogoDefault) !== null && _ref4 !== void 0 ? _ref4 : markDarkMode) !== null && _ref3 !== void 0 ? _ref3 : markDefault) !== null && _ref2 !== void 0 ? _ref2 : undefined;
  };
  /**
   * Render custom loading logo for both default mode and dark mode
   *
   * @returns a valid custom loading logo URL, or undefined
   */


  const customLoadingLogo = () => {
    return darkMode ? customLoadingLogoDarkMode() : customLoadingLogoDefaultMode();
  };
  /**
   * Check if a horizontal loading is needed to be rendered.
   * Loading bar will be rendered only when a default mode mark URL or
   * dark mode mark URL is rendered as the loading logo. We add the
   * horizontal loading bar on the bottom of the static mark logo to have
   * some loading effect for the loading page.
   *
   * @returns a loading bar component or no loading bar component
   */


  const renderBrandingEnabledOrDisabledLoadingBar = () => {
    if (customLoadingLogo() && !loadingLogoDefault) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "osdProgress"
      });
    }
  };
  /**
   * Check if we render a custom loading logo or the default opensearch spinner.
   * If customLoadingLogo() returns undefined(no valid custom URL is found), we
   * render the default opensearch logo spinenr
   *
   * @returns a image component with custom logo URL, or the default opensearch logo spinner
   */


  const renderBrandingEnabledOrDisabledLoadingLogo = () => {
    if (customLoadingLogo()) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "loadingLogoContainer"
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "loadingLogo",
        src: customLoadingLogo(),
        alt: applicationTitle + ' logo'
      }));
    }

    return openSearchLogoSpinner;
  };

  return /*#__PURE__*/_react.default.createElement("html", {
    lang: locale
  }, /*#__PURE__*/_react.default.createElement("head", null, /*#__PURE__*/_react.default.createElement("meta", {
    charSet: "utf-8"
  }), /*#__PURE__*/_react.default.createElement("meta", {
    httpEquiv: "X-UA-Compatible",
    content: "IE=edge,chrome=1"
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width"
  }), /*#__PURE__*/_react.default.createElement("title", null, applicationTitle), /*#__PURE__*/_react.default.createElement(_fonts.Fonts, {
    url: uiPublicUrl
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: favicon !== null && favicon !== void 0 ? favicon : `${uiPublicUrl}/favicons/apple-touch-icon.png`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: favicon !== null && favicon !== void 0 ? favicon : `${uiPublicUrl}/favicons/favicon-32x32.png`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: favicon !== null && favicon !== void 0 ? favicon : `${uiPublicUrl}/favicons/favicon-16x16.png`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "manifest",
    href: favicon ? `` : `${uiPublicUrl}/favicons/manifest.json`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "mask-icon",
    color: "#e8488b",
    href: favicon !== null && favicon !== void 0 ? favicon : `${uiPublicUrl}/favicons/safari-pinned-tab.svg`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "shortcut icon",
    href: favicon !== null && favicon !== void 0 ? favicon : `${uiPublicUrl}/favicons/favicon.ico`
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "msapplication-config",
    content: favicon ? `` : `${uiPublicUrl}/favicons/browserconfig.xml`
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "theme-color",
    content: "#ffffff"
  }), /*#__PURE__*/_react.default.createElement(_styles.Styles, {
    darkMode: darkMode
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "add-styles-here"
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "add-scripts-here"
  })), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/(0, _react.createElement)('osd-csp', {
    data: JSON.stringify({
      strictCsp
    })
  }), /*#__PURE__*/(0, _react.createElement)('osd-injected-metadata', {
    data: JSON.stringify(injectedMetadata)
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "osdWelcomeView",
    id: "osd_loading_message",
    style: {
      display: 'none'
    },
    "data-test-subj": "osdLoadingMessage"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "osdLoaderWrap",
    "data-test-subj": "loadingLogo"
  }, renderBrandingEnabledOrDisabledLoadingLogo(), /*#__PURE__*/_react.default.createElement("div", {
    className: "osdWelcomeText",
    "data-error-message": i18n('core.ui.welcomeErrorMessage', {
      defaultMessage: `${injectedMetadata.branding.applicationTitle} did not load properly. Check the server output for more information.`
    })
  }, i18n('core.ui.welcomeMessage', {
    defaultMessage: `Loading ${injectedMetadata.branding.applicationTitle}`
  })), renderBrandingEnabledOrDisabledLoadingBar())), /*#__PURE__*/_react.default.createElement("div", {
    className: "osdWelcomeView",
    id: "osd_legacy_browser_error",
    style: {
      display: 'none'
    }
  }, openSearchLogo, /*#__PURE__*/_react.default.createElement("h2", {
    className: "osdWelcomeTitle"
  }, i18n('core.ui.legacyBrowserTitle', {
    defaultMessage: 'Please upgrade your browser'
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "osdWelcomeText"
  }, i18n('core.ui.legacyBrowserMessage', {
    defaultMessage: 'This OpenSearch installation has strict security requirements enabled that your current browser does not meet.'
  }))), /*#__PURE__*/_react.default.createElement("script", null, `
            // Since this is an unsafe inline script, this code will not run
            // in browsers that support content security policy(CSP). This is
            // intentional as we check for the existence of __osdCspNotEnforced__ in
            // bootstrap.
            window.__osdCspNotEnforced__ = true;
          `), /*#__PURE__*/_react.default.createElement("script", {
    src: bootstrapScriptUrl
  })));
};

exports.Template = Template;