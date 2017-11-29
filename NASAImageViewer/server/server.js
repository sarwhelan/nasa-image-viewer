var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // parsing request URLs
var validator = require('validator'); // IMPORTANT: USE THIS TO SANITIZE INPUT

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// connect to mongoose and set up email verification dependencies
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

var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('./models/user');
var validator = require('validator');

/* router.route('/login')

  .post(function(req, res) {
    var usr = new User();
    // sanitize input
    usr.userName = validator.escape(req.body.userName);
    usr.password = validator.escape(req.body.password);

    User.findOne({'userName': usr.userName}, function(err, user) {
      if(err)
        return res.send(err);
      if (!user) // user wasn't found
        return res.json('Error: Email or password is incorrect.');
      // take password inputted and compare w/ password in system, going to use bcrypt
      bcrypt.compare(usr.password, user.password, function(err, correct) {
        if(err)
          return res.send(err);
        else if(!correct) // not matching
          return res.json('Error: Email or password is incorrect.');
        else { // passwords match
          return res.success;
        }

      })
    });


  });
  */

module.exports = app;
