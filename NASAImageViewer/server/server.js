var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // parsing request URLs
var validator = require('validator'); // IMPORTANT: USE THIS TO SANITIZE INPUT

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

var port = process.env.PORT || 8080;

// connect to mongoose
var mongoose = require('mongoose');
try {
    mongoose.Promise = global.Promise;
}
catch(e) {
    // do nothing
}

var User = require('./models/user'),
    nev = require('email-verification')(mongoose);

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

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

// start the server
app.listen(8080, function () {
    console.log('Server listening on port 8080!');
});


module.exports = app;
