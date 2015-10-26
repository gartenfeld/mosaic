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
  normalizeImageSize();
  sliceImageRows(image);
  // generate place holders
  // load tiles using promises
  // render tiles row by row
};

var normalizeImageSize = function() {
  // trim image size to multiples of tile size
};

// TILE_WIDTH = 16;
// TILE_HEIGHT = 16;
// COLOR_DEPTH = 16;
// SAMPLE_RATE = 8;

var sliceImageRows = function(image) {
  
  var row;
  for (var y = 0; y < IMAGE_HEIGHT; y += TILE_HEIGHT) {
    row = image.getImageData(0, y, IMAGE_WIDTH, TILE_HEIGHT).data;

    // spawn new worker
    // send row to worker (by transfer)

  }

  
  
  // // it's much faster to generate the array
  // var start = new Date();
  // var diff = new Date() - start;
  // console.log(diff);


};



var extractFileReference = function(event) {
  readImageBlob(event.target.files[0]);
};

δ('file').on('change', extractFileReference);
δ('zone').on('drop', readImageBlob);
