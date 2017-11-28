var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // parsing request URLs
var validator = require('validator'); // IMPORTANT: USE THIS TO SANITIZE INPUT

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// connect to mongoose
var mongoose = require('mongoose');
try {
    mongoose.Promise = global.Promise;
}
catch(e) {
    // do nothing
}
mongoose.connect('mongodb://127.0.0.1/collections', {
  useMongoClient: true
});
// ---------------------------

var logger = require('morgan'); // for logging requests
app.use(logger('dev'));

// routing done in ./routes folder!!!
var index = require('./routes/index');
app.use('/', index);
var api = require('./routes/api');
app.use('/api', api);

// handle any 404's
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// start the server
app.listen(8080, function () {
    console.log('Server listening on port 8080!');
});

module.exports = app;
