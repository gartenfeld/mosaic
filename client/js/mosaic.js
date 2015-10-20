function selected(event) {
  var ref = event.target.files[0];
  draw(ref);
}

function dragging(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function dropped(event) {
  event.stopPropagation();
  event.preventDefault();
  var ref = event.dataTransfer.files[0];
  draw(ref);
}

document.getElementById('file')
  .addEventListener('change', selected);

document.getElementById('zone')
  .addEventListener('dragover', dragging);

document.getElementById('zone')
  .addEventListener('drop', dropped);

function draw(source) {
  var image = new Image();
  var reader = new FileReader();
  var rendered = document.createElement('canvas').getContext('2d');
  reader.onload = function(event) {
    image.src = event.target.result;
    rendered.drawImage(image, 0, 0);
    analyze(rendered);
  };
  reader.readAsDataURL(source);
}

function analyze(image) {
  // determine image size

  // sample colors
  // 
  // var pixel = image.getImageData(0, 0, 1, 1).data;
  // console.log(pixel);
}
