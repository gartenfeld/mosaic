var bake = require('./kiln');
var cache = {};

module.exports = function (req, res) {

  var dispatch = function(data) {
    res.type('png');
    res.status(200).send(data);
  };

  var hex = req.params.hex;
  // if the api call requests a valid hex value
  if (hex.match(/[0-9a-fA-F]{6}/)) {
    // check if the response is cached
    if (hex in cache) {
      // send the cached tile
      dispatch(cache[hex]);
    } else {
      // generate a new tile from the 'kiln' 
      // which takes a hex value and a callback
      bake(hex, function(tile) {
        cache[hex] = tile;
        dispatch(tile);
      });
    }
  } else {
    res.status(404).end();
  }

};

