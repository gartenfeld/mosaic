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

Element.prototype.hide = function() {
  this.el.style.opacity = '0';
  this.el.style.display = 'none';
  return this;
};

Element.prototype.show = function() {
  this.el.style.opacity = '1';
  this.el.style.display = 'flex';
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

var stored = {};

window.δ = function(id) {
  stored[id] = stored[id] || new Element(id);
  return stored[id];
};