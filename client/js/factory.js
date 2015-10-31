importScripts('settings.js');

// COLOR_DEPTH = 16;
// SAMPLE_RATE = 8;
var IMAGE_WIDTH = 0;

var hexify = function(num) {
  return ('00' + num.toString(16)).substr(-2);
};

var reduceColor = function(r, g, b) {
  r -= (r % COLOR_DEPTH);
  g -= (g % COLOR_DEPTH);
  b -= (b % COLOR_DEPTH);
  return hexify(r) + hexify(g) + hexify(b);
};

var encodeTile = function(input) {
  var buffer = new Uint8Array(input),
      i = buffer.length,
      binary = new Array(i);
  while (i--) {
    binary[i] = String.fromCharCode(buffer[i]);
  } 
  return btoa(binary.join(''));
};

var FileReader = FileReader || null;
var prefix = FileReader ? '' : 'data:image/jpeg;base64,';

var downloadTile = function(hex, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '../color/' + hex, true);
  xhr.responseType = FileReader ? 'blob' : 'arraybuffer';
  xhr.onload = function() {
    if (this.status === 200) {
      if (FileReader) {
        var reader = new FileReader();
        reader.onloadend = function() {             
          callback(reader.result);
        };
        reader.readAsDataURL(this.response); 
      } else {
        callback(encodeTile(this.response));
      }
    }
  };
  xhr.send();
};

var cache = {};

var retrieveTile = function(hex, callback) {
  if (cache[hex]) {
    callback(cache[hex]);
  } else {
    downloadTile(hex, function(tile) {
      callback(tile);
      cache[hex] = tile;
    });
  }
};

var reduceRowData = function(flat, callback) {

  IMAGE_WIDTH = flat.length / (4 * TILE_HEIGHT);

  var sampleAverageColor = function(offset) {
    var cursor, x, y, 
        rSum = 0, gSum = 0, bSum = 0, r, g, b;
    for (var s = 0; s < SAMPLE_RATE; s++) {
      x = Math.floor(Math.random() * TILE_WIDTH);
      y = Math.floor(Math.random() * TILE_HEIGHT);
      cursor = (y * IMAGE_WIDTH + offset + x) * 4;
      rSum += flat[cursor];
      gSum += flat[cursor + 1];
      bSum += flat[cursor + 2];
    }
    r = Math.floor(rSum / SAMPLE_RATE);
    g = Math.floor(gSum / SAMPLE_RATE);
    b = Math.floor(bSum / SAMPLE_RATE);
    return reduceColor(r, g, b);
  };

  var tiles = [],
      stack = 0;

  var buildEncodedTileImage = function(offset) {
    retrieveTile(sampleAverageColor(offset), function(base64) {
      tiles[offset / TILE_WIDTH] = base64;
      if (--stack === 0) {
        buildRowHTML();
      }
    });
  };

  var html = '';

  var buildRowHTML = function() {
    tiles.forEach(function(base64) {
      html += '<img src="' + prefix + base64 + '" />';
    });
    callback(html);
  };

  var buildSimulatedRowHTML = function() {
    tiles.forEach(function(hex) {
      html += '<div class="frame"><div class="circle" style="background-color:' + hex + ';"></div></div>';
    });
    callback(html);
  };

  var generateTiles = function() {
    for (var i = 0; i < IMAGE_WIDTH; i += TILE_WIDTH) {
      stack++;
      buildEncodedTileImage(i);
    }
  };
  // generateTiles();

  /* SIMULATION */
  var simulateTiles = function() {
    for (var i = 0; i < IMAGE_WIDTH; i += TILE_WIDTH) {
      tiles[i / TILE_WIDTH] = '#' + sampleAverageColor(i);
    }
    buildSimulatedRowHTML();
  };
  simulateTiles();
  
};
