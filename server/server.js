var path = require('path');
var store = require('./tiles');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', function(req, res) {
  res.redirect('index.html');
});

app.get('/color/:hex', store);

app.listen(app.get('port'));
