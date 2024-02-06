"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatusRoute = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _configSchema = require("@osd/config-schema");

var _legacy_status = require("../legacy_status");

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
const SNAPSHOT_POSTFIX = /-SNAPSHOT$/;

const registerStatusRoute = ({
  router,
  config,
  metrics,
  status
}) => {
  // Since the status.plugins$ observable is not subscribed to elsewhere, we need to subscribe it here to eagerly load
  // the plugins status when OpenSearch Dashboards starts up so this endpoint responds quickly on first boot.
  const combinedStatus$ = new _rxjs.ReplaySubject(1);
  (0, _rxjs.combineLatest)([status.overall$, status.core$, status.plugins$]).subscribe(combinedStatus$);
  router.get({
    path: '/api/status',
    options: {
      authRequired: !config.allowAnonymous,
      tags: ['api'] // ensures that unauthenticated calls receive a 401 rather than a 302 redirect to login page

    },
    validate: {
      query: _configSchema.schema.object({
        v8format: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, async (context, req, res) => {
    var _req$query;

    const {
      version,
      buildSha,
      buildNum
    } = config.packageInfo;
    const versionWithoutSnapshot = version.replace(SNAPSHOT_POSTFIX, '');
    const [overall, core, plugins] = await combinedStatus$.pipe((0, _operators.first)()).toPromise();
    let statusInfo;

    if ((_req$query = req.query) !== null && _req$query !== void 0 && _req$query.v8format) {
      statusInfo = {
        overall,
        core,
        plugins
      };
    } else {
      statusInfo = (0, _legacy_status.calculateLegacyStatus)({
        overall,
        core,
        plugins,
        versionWithoutSnapshot
      });
    }

    const lastMetrics = await metrics.getOpsMetrics$().pipe((0, _operators.first)()).toPromise();
    const body = {
      name: config.serverName,
      uuid: config.uuid,
      version: {
        number: versionWithoutSnapshot,
        build_hash: buildSha,
        build_number: buildNum,
        build_snapshot: SNAPSHOT_POSTFIX.test(version)
      },
      status: statusInfo,
      metrics: {
        last_updated: lastMetrics.collected_at.toISOString(),
        collection_interval_in_millis: metrics.collectionInterval,
        os: lastMetrics.os,
        process: lastMetrics.process,
        response_times: lastMetrics.response_times,
        concurrent_connections: lastMetrics.concurrent_connections,
        requests: { ...lastMetrics.requests,
          status_codes: lastMetrics.requests.statusCodes
        }
      }
    };
    return res.ok({
      body
    });
  });
};

exports.registerStatusRoute = registerStatusRoute;