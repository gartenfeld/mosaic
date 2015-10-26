importScripts('factory.js');

onmessage = function (e) {
  var row = e.data.row;
  var index = e.data.index;

  // available from 'shared'
  // someFunction();

  var payload = { results: results, index: index };
  postMessage(payload);
};