"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirm = confirm;
exports.question = question;

var _readline = require("readline");

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
 * @param {String} question
 * @param {Object|null} options
 * @property {Boolean} options.default
 * @property {Stream} options.input - defaults to process.stdin
 * @property {Stream} options.output - defaults to process.stdout
 */
function confirm(question, options = {}) {
  const rl = (0, _readline.createInterface)({
    input: options.input || process.stdin,
    output: options.output || process.stdout
  });
  return new Promise(resolve => {
    const defaultValue = options.default ? true : false;
    const defaultPrompt = defaultValue ? 'Y/n' : 'y/N';
    rl.question(`${question} [${defaultPrompt}] `, input => {
      let value = defaultValue;

      if (input != null && input !== '') {
        value = /^y(es)?/i.test(input);
      }

      rl.close();
      resolve(value);
    });
  });
}
/**
 * @param {String} question
 * @param {Object|null} options
 * @property {Boolean} options.mask
 * @property {Stream} options.input - defaults to process.stdin
 * @property {Stream} options.output - defaults to process.stdout
 */


function question(question, options = {}) {
  const input = options.input || process.stdin;
  const output = options.output || process.stdout;
  const questionPrompt = `${question}: `;
  const rl = (0, _readline.createInterface)({
    input,
    output
  });
  return new Promise(resolve => {
    input.on('data', char => {
      char = char + '';

      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          input.pause();
          break;

        default:
          if (options.mask) {
            output.cursorTo(questionPrompt.length);
            output.write(Array(rl.line.length + 1).join(options.mask || '*'));
          }

          break;
      }
    });
    rl.question(questionPrompt, value => {
      resolve(value);
    });
  });
}