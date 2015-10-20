function selected(event) {
  var img = event.target.files[0];
  console.log(img);
}

function dragging(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function dropped(event) {
  event.stopPropagation();
  event.preventDefault();
  var img = event.dataTransfer.files[0];
  console.log(img);
}

document.getElementById('file')
  .addEventListener('change', selected, false);

document.getElementById('zone')
  .addEventListener('dragover', dragging, false);
document.getElementById('zone')
  .addEventListener('drop', dropped, false);
  