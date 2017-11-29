var User = require('../models/user');
var validator = require('validator');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var app = express();

// do everything in here! all create/post/update/delete stuff

router.use(function(req, res, next) {
    console.log('Something is happening!');
    next();
});

router.get('/', function(req, res) {
  res.json({message: 'Hello World'});
});

// login
router.route('/login')

  .post(function(req, res) {

    console.log("user: " + req.body.username + " pass: " + req.body.password);
    var usr = new User();

    // sanitize input
    usr.username = validator.escape(req.body.username);
    usr.password = validator.escape(req.body.password);

    User.findOne({'username': usr.username}, function(err, user) {
      if(err)
        return res.send(err);
      if (!user) { // user wasn't found
        console.log("user doesn't exist");
        return res.json({message:'Error: Email or password is incorrect.'});
      }
      // take password inputted and compare w/ password in system, going to use bcrypt
      bcrypt.compare(usr.password, user.password, function(err, correct) {
        if(err)
          return res.send(err);
        else if(!correct) {// not matching
          console.log("passwords don't match");
          return res.json({message:'Error: Email or password is incorrect.'});
        }
        else { // passwords match
          console.log("user login successful");
          return res.success;
        }

      })
    });


  }); // --- end of POST /login

app.use('/api', router);

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

module.exports = router;
