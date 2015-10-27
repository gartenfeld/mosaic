importScripts('factory.js');

onmessage = function (e) {
  var row = e.data.row;

  // available from 'shared'
  // someFunction();

  var payload = { results: '', index: e.data.index };
  postMessage(payload);
};