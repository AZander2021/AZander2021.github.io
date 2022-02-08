var name = 'CommunityMirror';
var communityMirrorServiceUUID = '13333333-3333-3333-3333-333333333337';
var characteristics = { 
  idrequest: '13333333-3333-3333-3333-333333330001',
  username: '13333333-3333-3333-3333-333333330002',
  password: '13333333-3333-3333-3333-333333330003' 
};

var toppingsEls = document.getElementById('register');
var username = document.getElementById('username');
var password = document.getElementById('password');

// store characteristics after retrieval
var cachedCharacteristics = {};

// current bluetooth connection obj
var communityMirrorServer = null;

// connect to bluetooth peripheral
var readyCM = function() {
  return navigator.bluetooth.requestDevice({
    filters: [{ services: [ communityMirrorServiceUUID ], name: name }]

  }).then(function(device) {
    return device.gatt.connect();

  }).then(function(server) {
    communityMirrorServer = server;
    return server.getPrimaryService(communityMirrorServiceUUID);
    
  }).then(function(service) {
    return Promise.all(Object.values(characteristics).map((uuid)=>service.getCharacteristic(uuid)));

  }).then(function(characteristicObjs) {
    Object.keys(characteristics).forEach((name, i)=> {
      cachedCharacteristics[name] = characteristicObjs[i];
    });

  }).catch(function(err) {
    alert('communitymirror (bluetooth) error');
    throw err;
  });
};

// button listeners
var onStartButtonClick = function(e) {
  if(communityMirrorServer != null && communityMirrorServer.connected) {
    alert('Already connected...');
    return;
  }
  readyCM().then(function() {
    alert('Connection successful!');
  });
};
