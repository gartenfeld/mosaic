var settings = require('../client/js/settings');
var Magick = require('gm');

module.exports = function(hex, callback) {

  var gw = Magick(settings.TILE_WIDTH, settings.TILE_HEIGHT, '#ffffff00')
    .fill('#' + hex)
    .stroke('white', 0)
    .drawRectangle(-1, -1, settings.TILE_WIDTH, settings.TILE_HEIGHT)
    .stream('png');
  var chunks = [];
  gw.on('data', function(chunk) { chunks.push(chunk); });
  gw.on('end', function() {
    var buf = Buffer.concat(chunks);
    callback(buf);
  });

};

// Refs:
// http://aheckmann.github.io/gm/docs.html