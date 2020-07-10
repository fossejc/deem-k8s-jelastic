var k8smCount = '${settings.topo}' == '0-dev' ? 1 : 3,
    workerCount = k8smCount > 1 ? 2 : 1, 
    tag = "${settings.version}";
var resp = {
  result: 0,
  ssl: !!jelastic.billing.account.GetQuotas('environment.jelasticssl.enabled').array[0].value,
  nodes: [{
    count: k8smCount,
    cloudlets: 32,
    nodeType: "kubernetes",
    tag: tag,
    scalingMode: "stateless",
    nodeGroup: "k8sm",
    isRedeploySupport: false,
    addons: [],
    displayName: "Master",
    extip: false,
    env: {
      JELASTIC_EXPOSE: false
    }
  }, {
    count: workerCount,
    nodeGroup: "cp",
    nodeType: "kubernetes",
    tag: tag,
    scalingMode: "stateless",
    displayName: "Workers",
    cloudlets: 32,
    isRedeploySupport: false,
    extip: ${settings.extip:false},
    env: {
      JELASTIC_EXPOSE: false
    }
  }]
}

if ('${settings.storage}' == 'true') {
  var path = "/data";
  resp.nodes.push({
    count: 1,
    nodeType: "storage",
    cloudlets: 8,
    displayName: "Storage",
    nodeGroup: "storage",
    volumes: [
      path
    ]
  })

  for (var i = 0; i < 2; i++){
    var n = resp.nodes[i];
    n.volumes = [path];
    n.volumeMounts = {};
    n.volumeMounts[path] = {
        readOnly: false,
        sourcePath: path,
        sourceNodeGroup: "storage"
    };
  }
}
return resp;
