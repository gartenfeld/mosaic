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
  generateMosaic(context);
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var generateMosaic = function(image) {
  normalizeImageSize();
  sliceImageRows(image);
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
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
var receiveWorkerData = function(e) {

  // e.data.results; 
  // e.data.index;
  // 
  // replace inner html of the corresponding placeholder
  // 
  // call top-to-bottom checking funciton
  // show next available rows

};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var delegateTask = function(row, index) {
  var worker = new Worker("js/worker.js");
  worker.onmessage = receiveWorkerData;
  var workload = { row: row, index: index };
  worker.postMessage(workload);
};

/**
 * function() description
 *
 * @param {Type} variable
 * @return {Type} variable
 */
var addRowPlaceholder = function(index) {

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
