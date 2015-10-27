var Element = function(el) {
  this.el = el;
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

Element.prototype.style = function(key, value) {
  this.el.style[key] = value;
  return this;
};

Element.prototype.append = function(tag, attributes) {
  var child = document.createElement(tag);
  for (var key in attributes) {
    child.setAttribute(key, attributes[key]);
  }
  this.el.appendChild(child);
  return new Element(child);
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
  stored[id] = stored[id] || new Element(document.getElementById(id));
  return stored[id];
};