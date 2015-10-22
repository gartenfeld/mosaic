var IMAGE_WIDTH = 0,
    IMAGE_HEIGHT = 0;

var readImageBlob = function(file) {
  var reader = new FileReader();
  reader.onload = function(event) {
    setImageSource(event.target.result); 
  };
  reader.readAsDataURL(file);
};

var setImageSource = function(source) {
  var image = new Image();
  image.onload = function() {
    rasterizeImageData(image);
  };
  image.src = source;
  δ('original').show().el.src = source;
  δ('zone').hide();
};

var rasterizeImageData = function(image) {
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
  canvas.width = IMAGE_WIDTH = image.width;
  canvas.height = IMAGE_HEIGHT = image.height; 
  context.drawImage(image, 0, 0);
  generateMosaic(context);
};

var generateMosaic = function(image) {
  sliceImageGrid(image);
  // generate place holders
  // load tiles using promises
  // render tiles row by row
};

// var TILE_WIDTH = 16;
// var TILE_HEIGHT = 16;
// var COLOR_DEPTH = 16;
// var SAMPLE_RATE = 8;

var sliceImageGrid = function(image) {
  // determine image size
};

var sampleAverageColor = function(image, left, top) {

  var x = 0, y = 0;
  var pixel = image.getImageData(x, y, 1, 1).data;
  console.log(pixel);

};

var reduceColor = function(r, g, b) {
  var hex;
  return hex;
};

var extractFileReference = function(event) {
  readImageBlob(event.target.files[0]);
};

δ('file').on('change', extractFileReference);
δ('zone').on('drop', readImageBlob);
