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

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var sliceImageRows = function(image) {
  var row, index;
  for (var y = 0; y < IMAGE_HEIGHT; y += TILE_HEIGHT) {
    index = y / TILE_HEIGHT;
    addRowPlaceholder(index);
    row = image.getImageData(0, y, IMAGE_WIDTH, TILE_HEIGHT).data;
    delegateTask(row, index);
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
  rows[index] = { ready: false, node: node};
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
  showContiguousRows();
};

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
