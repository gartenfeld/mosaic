var rasterize = function(source) {
  var image = new Image();
  var reader = new FileReader();
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
  reader.onload = function(event) {
    image.src = event.target.result;
    context.drawImage(image, 0, 0);
    analyze(context);
  };
  reader.readAsDataURL(source);
};

var analyze = function(image) {
  // determine image size

  // sample colors
  var pixel = image.getImageData(0, 0, 1, 1).data;
  console.log(pixel);
};

var retrieve = function(event) {
  rasterize(event.target.files[0]);
};

δ('file').on('change', retrieve);
δ('zone').on('drop', rasterize);
