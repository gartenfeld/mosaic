var IMAGE_WIDTH = 0,
    IMAGE_HEIGHT = 0;

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var readImageBlob = function(file) {
  var reader = new FileReader();
  reader.onload = function(event) {
    setImageSource(event.target.result); 
  };
  reader.readAsDataURL(file);
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var setImageSource = function(source) {
  var image = new Image();
  image.onload = function() {
    rasterizeImageData(image);
  };
  image.src = source;
  δ('original').show().el.src = source;
  δ('zone').hide();
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var rasterizeImageData = function(image) {
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
  canvas.width = IMAGE_WIDTH = image.width;
  canvas.height = IMAGE_HEIGHT = image.height; 
  context.drawImage(image, 0, 0);
  normalizeImageSize();
  sliceImageRows(context);
};

/**
 * function() description
 */
var normalizeImageSize = function() {
  IMAGE_WIDTH -= (IMAGE_WIDTH % TILE_WIDTH);
  IMAGE_HEIGHT -= (IMAGE_HEIGHT % TILE_HEIGHT);
};

var hexify = function(num) {
  return ('00' + num.toString(16)).substr(-2);
};

var reduceColor = function(r, g, b) {
  r -= (r % COLOR_DEPTH);
  g -= (g % COLOR_DEPTH);
  b -= (b % COLOR_DEPTH);
  return hexify(r) + hexify(g) + hexify(b);
};

var reduceRowData = function(flat, index, callback) {

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

  var buildSimulatedRowHTML = function() {
    tiles.forEach(function(hex) {
      html += '<div class="frame"><div class="circle" style="background-color:' + hex + ';"></div></div>';
    });
    callback(html, index);
  };

  /* SIMULATION */
  var simulateTiles = function() {
    for (var i = 0; i < IMAGE_WIDTH; i += TILE_WIDTH) {
      tiles[i / TILE_WIDTH] = '#' + sampleAverageColor(i);
    }
    buildSimulatedRowHTML();
  };

  simulateTiles();
  
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */

var postHTML = function(html, index) {
  δ(index).el.innerHTML = html;
  rows[index].ready = true;
  showRowsWhenComplete();
};

var sliceImageRows = function(image) {
  var row, index;
  for (var y = 0; y < IMAGE_HEIGHT; y += TILE_HEIGHT) {
    index = y / TILE_HEIGHT;
    addRowPlaceholder(index);
    row = image.getImageData(0, y, IMAGE_WIDTH, TILE_HEIGHT).data;
    reduceRowData(row, index, postHTML);
  }
};

var rows = {};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var addRowPlaceholder = function(index) {
  var attributes = { 'id': '' + index, 'class': 'row' };
  var node = δ('projection').append('div', attributes);
  node.style('height', TILE_HEIGHT + 'px');
  node.style('width', IMAGE_WIDTH + 'px');
  rows[index] = { ready: false, node: node };
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var delegateTask = function(row, index) {
  var worker = new Worker("js/worker.js"),
      workload = { row: row, index: index };
  worker.onmessage = ingestWorkerPayload;
  worker.postMessage(workload);
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var ingestWorkerPayload = function(e) {
  var index = e.data.index;
  δ(index).el.innerHTML = e.data.results;
  rows[index].ready = true;
  // showContiguousRows();
  showRowsWhenComplete();
};

var showRowsWhenComplete = (function() {
  var completed = 0;
  return function() {
    if (++completed === Object.keys(rows).length) {
      for (var i = 0; i < Object.keys(rows).length; i++) {
        rows[i].node.show();
      }
      δ('original').hide();
    }
  };
})();

/**
 * function() description
 */
var showContiguousRows = (function() {
  var init = true, start = 0;
  return function() {
    init = init && δ('original').hide() && false;
    while (rows[start] && rows[start].ready) {
      rows[start++].node.show();
    }
  };
})();

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var extractFileReference = function(event) {
  readImageBlob(event.target.files[0]);
};

δ('file').on('change', extractFileReference);
δ('zone').on('drop', readImageBlob);
