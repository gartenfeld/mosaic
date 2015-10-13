var Magick = require('gm').subClass({ imageMagick: true });
var settings = require('../client/js/settings');
var width = settings.TILE_WIDTH,
    height = settings.TILE_HEIGHT,
    xCenter = 0.5 * width - 0.5,
    yCenter = 0.5 * height - 0.5,
    cover = 4,
    xEdge = width - cover,
    yEdge = height - cover;

module.exports = function(hex, callback) {

  var tile = Magick(width, height, '#ffffff00')
    .fill('#' + hex)
    .stroke('#ffffff00', 0)
    .drawCircle( xCenter, yCenter, xEdge, yEdge)
    .stream('png');

  var chunks = [];
  tile.on('data', function(chunk) { chunks.push(chunk); });
  tile.on('end', function() {
    callback(Buffer.concat(chunks));
  });

};

// Refs:
// http://aheckmann.github.io/gm/docs.html