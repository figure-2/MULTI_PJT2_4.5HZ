"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodeId = void 0;
exports.mapNodesVersionCompatibility = mapNodesVersionCompatibility;
exports.pollOpenSearchNodesVersion = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _opensearch_opensearch_dashboards_version_compatability = require("./opensearch_opensearch_dashboards_version_compatability");

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
 * OpenSearch and OpenSearch Dashboards versions are locked, so OpenSearch Dashboards should require that OpenSearch has the same version as
 * that defined in OpenSearch Dashboards's package.json.
 */

/**
 * Checks if all nodes in the cluster have the same cluster id node attribute
 * that is supplied through the healthcheck param. This node attribute is configurable
 * in opensearch_dashboards.yml. It can also filter attributes out by key-value pair.
 * If all nodes have the same cluster id then we do not fan out the healthcheck and use '_local' node
 * If there are multiple cluster ids then we return an array of node ids to check.
 * If the supplied node attribute is missing then we return null and use default fan out behavior
 * @param {OpenSearchClient} internalClient
 * @param {OptimizedHealthcheck} healthcheck
 * @returns {string|string[]|null} '_local' if all nodes have the same cluster_id, array of node ids if different cluster_id, null if no cluster_id or nodes returned
 */
const getNodeId = async (internalClient, healthcheck) => {
  try {
    var _nodes$firstNodeId$at, _nodes$firstNodeId$at2;

    // If missing an id, we have nothing to check
    if (!healthcheck.id) return null;
    let path = `nodes.*.attributes.${healthcheck.id}`;
    const filters = healthcheck.filters;
    const filterKeys = filters ? Object.keys(filters) : [];

    for (const key of filterKeys) {
      path += `,nodes.*.attributes.${key}`;
    }
    /*
     * Using _cluster/state/nodes to retrieve the cluster_id of each node from cluster manager node which
     * is considered to be a lightweight operation to aggegrate different cluster_ids from the OpenSearch nodes.
     */


    const state = await internalClient.cluster.state({
      metric: 'nodes',
      filter_path: [path]
    });
    const nodes = state.body.nodes;
    const nodeIds = new Set(Object.keys(nodes));
    /*
     * If filters are set look for the key and value and filter out any node that matches
     * the value for that attribute.
     */

    for (const id of nodeIds) {
      for (const key of filterKeys) {
        var _nodes$id$attributes$, _nodes$id$attributes;

        const attributeValue = (_nodes$id$attributes$ = (_nodes$id$attributes = nodes[id].attributes) === null || _nodes$id$attributes === void 0 ? void 0 : _nodes$id$attributes[key]) !== null && _nodes$id$attributes$ !== void 0 ? _nodes$id$attributes$ : null;
        if (attributeValue === filters[key]) nodeIds.delete(id);
      }
    }

    if (nodeIds.size === 0) return null;
    const [firstNodeId] = nodeIds;
    const sharedClusterId = (_nodes$firstNodeId$at = (_nodes$firstNodeId$at2 = nodes[firstNodeId].attributes) === null || _nodes$firstNodeId$at2 === void 0 ? void 0 : _nodes$firstNodeId$at2[healthcheck.id]) !== null && _nodes$firstNodeId$at !== void 0 ? _nodes$firstNodeId$at : null; // If cluster_id is not set then fan out

    if (sharedClusterId === null) return null; // If a node is found to have a different cluster_id, return node ids

    for (const id of nodeIds) {
      var _nodes$id$attributes2;

      if (((_nodes$id$attributes2 = nodes[id].attributes) === null || _nodes$id$attributes2 === void 0 ? void 0 : _nodes$id$attributes2[healthcheck.id]) !== sharedClusterId) return Array.from(nodeIds);
    } // When all nodes share the same cluster_id, return _local


    return '_local';
  } catch (e) {
    return null;
  }
};

exports.getNodeId = getNodeId;

function getHumanizedNodeName(node) {
  var _node$http;

  const publishAddress = (node === null || node === void 0 ? void 0 : (_node$http = node.http) === null || _node$http === void 0 ? void 0 : _node$http.publish_address) + ' ' || '';
  return 'v' + node.version + ' @ ' + publishAddress + '(' + node.ip + ')';
}

function mapNodesVersionCompatibility(nodesInfo, opensearchDashboardsVersion, ignoreVersionMismatch) {
  var _nodesInfo$nodes;

  if (Object.keys((_nodesInfo$nodes = nodesInfo.nodes) !== null && _nodesInfo$nodes !== void 0 ? _nodesInfo$nodes : {}).length === 0) {
    return {
      isCompatible: false,
      message: 'Unable to retrieve version information from OpenSearch nodes.',
      incompatibleNodes: [],
      warningNodes: [],
      opensearchDashboardsVersion
    };
  }

  const nodes = Object.keys(nodesInfo.nodes).sort() // Sorting ensures a stable node ordering for comparison
  .map(key => nodesInfo.nodes[key]).map(node => Object.assign({}, node, {
    name: getHumanizedNodeName(node)
  })); // Aggregate incompatible OpenSearch nodes.

  const incompatibleNodes = nodes.filter(node => !(0, _opensearch_opensearch_dashboards_version_compatability.opensearchVersionCompatibleWithOpenSearchDashboards)(node.version, opensearchDashboardsVersion)); // Aggregate OpenSearch nodes which should prompt a OpenSearch Dashboards upgrade. It's acceptable
  // if OpenSearch and OpenSearch Dashboards versions are not the same as long as they are not
  // incompatible, but we should warn about it.
  // Ignore version qualifiers https://github.com/elastic/elasticsearch/issues/36859

  const warningNodes = nodes.filter(node => !(0, _opensearch_opensearch_dashboards_version_compatability.opensearchVersionEqualsOpenSearchDashboards)(node.version, opensearchDashboardsVersion)); // Note: If incompatible and warning nodes are present `message` only contains
  // an incompatibility notice.

  let message;

  if (incompatibleNodes.length > 0) {
    const incompatibleNodeNames = incompatibleNodes.map(node => node.name).join(', ');

    if (ignoreVersionMismatch) {
      message = `Ignoring version incompatibility between OpenSearch Dashboards v${opensearchDashboardsVersion} and the following OpenSearch nodes: ${incompatibleNodeNames}`;
    } else {
      message = `This version of OpenSearch Dashboards (v${opensearchDashboardsVersion}) is incompatible with the following OpenSearch nodes in your cluster: ${incompatibleNodeNames}`;
    }
  } else if (warningNodes.length > 0) {
    const warningNodeNames = warningNodes.map(node => node.name).join(', ');
    message = `You're running OpenSearch Dashboards ${opensearchDashboardsVersion} with some different versions of ` + 'OpenSearch. Update OpenSearch Dashboards or OpenSearch to the same ' + `version to prevent compatibility issues: ${warningNodeNames}`;
  }

  return {
    isCompatible: ignoreVersionMismatch || incompatibleNodes.length === 0,
    message,
    incompatibleNodes,
    warningNodes,
    opensearchDashboardsVersion
  };
} // Returns true if two NodesVersionCompatibility entries match


function compareNodes(prev, curr) {
  const nodesEqual = (n, m) => n.ip === m.ip && n.version === m.version;

  return curr.isCompatible === prev.isCompatible && curr.incompatibleNodes.length === prev.incompatibleNodes.length && curr.warningNodes.length === prev.warningNodes.length && curr.incompatibleNodes.every((node, i) => nodesEqual(node, prev.incompatibleNodes[i])) && curr.warningNodes.every((node, i) => nodesEqual(node, prev.warningNodes[i]));
}

const pollOpenSearchNodesVersion = ({
  internalClient,
  optimizedHealthcheck,
  log,
  opensearchDashboardsVersion,
  ignoreVersionMismatch,
  opensearchVersionCheckInterval: healthCheckInterval
}) => {
  log.debug('Checking OpenSearch version');
  return (0, _rxjs.timer)(0, healthCheckInterval).pipe((0, _operators.exhaustMap)(() => {
    /*
     * Originally, Dashboards queries OpenSearch cluster to get the version info of each node and check the version compatibility with each node.
     * The /nodes request could fail even one node in cluster fail to response
     * For better dashboards resilience, the behaviour is changed to only query the local node when all the nodes have the same cluster_id
     * Using _cluster/state/nodes to retrieve the cluster_id of each node from the cluster manager node
     */
    if (optimizedHealthcheck) {
      return (0, _rxjs.from)(getNodeId(internalClient, optimizedHealthcheck)).pipe((0, _operators.mergeMap)(nodeId => (0, _rxjs.from)(internalClient.nodes.info({
        node_id: nodeId,
        metric: 'process',
        filter_path: ['nodes.*.version', 'nodes.*.http.publish_address', 'nodes.*.ip']
      })).pipe((0, _operators.map)(({
        body
      }) => body), (0, _operators.catchError)(nodesInfoRequestError => {
        return (0, _rxjs.of)({
          nodes: {},
          nodesInfoRequestError
        });
      }))));
    } else {
      return (0, _rxjs.from)(internalClient.nodes.info({
        filter_path: ['nodes.*.version', 'nodes.*.http.publish_address', 'nodes.*.ip']
      })).pipe((0, _operators.map)(({
        body
      }) => body), (0, _operators.catchError)(nodesInfoRequestError => {
        return (0, _rxjs.of)({
          nodes: {},
          nodesInfoRequestError
        });
      }));
    }
  }), (0, _operators.map)(nodesInfo => mapNodesVersionCompatibility(nodesInfo, opensearchDashboardsVersion, ignoreVersionMismatch)), (0, _operators.distinctUntilChanged)(compareNodes) // Only emit if there are new nodes or versions
  );
};

exports.pollOpenSearchNodesVersion = pollOpenSearchNodesVersion;