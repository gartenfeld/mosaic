var Element = function(id) {
  this.el = document.getElementById(id);
};

Element.prototype.on = function(event, callback) {
  if (event === 'drop') {
    this.droppable(callback);
  } else {
    this.el.addEventListener(event, callback);
  }
  return this;
};

Element.prototype.droppable = function(callback) {
  var dragging = function(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };
  var dropped = function(event) {
    event.stopPropagation();
    event.preventDefault();
    callback(event.dataTransfer.files[0]);
  };
  this.el.addEventListener('dragover', dragging);
  this.el.addEventListener('drop', dropped);
};

window.δ = function(id) {
  return new Element(id);
};