var express = require('express');
var app = express();

app.use(express.static('templates'));


var server = app.listen(8080);
