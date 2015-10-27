importScripts('factory.js');

onmessage = function (e) {
  var row = e.data.row;
  var IMAGE_WIDTH = row.length / (4 * TILE_HEIGHT);

  // available from 'shared'
  // someFunction();
  var html = '';
  for (var i = 0; i < IMAGE_WIDTH; i += TILE_WIDTH) {
    html += '<img src="color/cccc00" />';
  }
  var payload = { results: html, index: e.data.index };
  
  setTimeout(function() {
    postMessage(payload);
  }, 0);
};