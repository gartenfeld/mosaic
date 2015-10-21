var IMAGE_WIDTH = 0,
    IMAGE_HEIGHT = 0;

var rasterizeImageData = function(source) {
  var image = new Image();
  var reader = new FileReader();
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
  reader.onload = function(event) {
    image.src = event.target.result;
    // canvas must be resized to contain full image
    canvas.width = IMAGE_WIDTH = image.width;
    canvas.height = IMAGE_HEIGHT = image.height; 
    context.drawImage(image, 0, 0);
    generateMosaic(context);
  };
  reader.readAsDataURL(source);
};

var generateMosaic = function(image) {
  analyzeImageGrid(context);
};

var analyzeImageGrid = function(image) {
  // determine image size

};

var sampleAverageColor = function(image, left, top) {

  var x = 0, y = 0;
  var pixel = image.getImageData(x, y, 1, 1).data;
  console.log(pixel);

};

var reduceColor = function(hex) {

};

var extractFileReference = function(event) {
  rasterizeImageData(event.target.files[0]);
};

δ('file').on('change', extractFileReference);
δ('zone').on('drop', rasterizeImageData);
