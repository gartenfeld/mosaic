var bake = require('./kiln');

var cache = {};

var retrieve = function(hex, callback) {
  if (hex in cache) {
    callback(cache[hex]);
  } else {
    bake(hex, function(tile) {
      cache[hex] = tile;
      callback(tile);
    });
  }
};

module.exports.prebake = function(step) {
  var hexify = function(num) {
    return ('00' + num.toString(16)).substr(-2);
  };
  var queue = [];
  for (var r = 0; r < 0xFF; r += step) {
    for (var g = 0; g < 0xFF; g += step) {
      for (var b = 0; b < 0xFF; b += step) {
        queue.push(hexify(r) + hexify(g) + hexify(b));
      }
    }
  }
  console.log('Generating ' + queue.length + ' colors.');
  var start = new Date().getTime();
  var next = function() {
    if (queue.length) {
      var color = queue.shift();
      bake(color, function(tile) {
        cache[color] = tile;
        next();
      });
    } else {
      var end = new Date().getTime(),
          diff = Math.round((end - start) / 1000);
      console.log('Prebaking completed in ' + diff + ' seconds.');
    }
  };
  next();
};

module.exports.handler = function (req, res) {
  var hex = req.params.hex;
  if (hex.match(/[0-9a-fA-F]{6}/)) {
    retrieve(hex, function dispatch(data) {
      res.type('png');
      res.status(200).send(data);
    });
  } else {
    res.status(404).end();
  }
};


