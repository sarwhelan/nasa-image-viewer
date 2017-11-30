var User = require('../models/user');
var TempUser = require('../models/tempUser');
var validator = require('validator');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var app = express();

var mongoose = require('mongoose');
try {
    mongoose.Promise = global.Promise;
}
catch(e) {
    // do nothing
}

var User = require('../models/user');

mongoose.connect('mongodb://127.0.0.1/collections', {
  useMongoClient: true
});

var nev = require('email-verification')(mongoose);
// ---------------------------

// sync version of hashing function
var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
};

// async version of hashing function
myHasher = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.genSalt(8, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            return insertTempUser(hash, tempUserData, callback);
        });
    });
};

// NEV configuration =====================
nev.configure({
    persistentUserModel: User,
    expirationTime: 600, // 10 minutes

    verificationURL: 'http://localhost:8080/api/email-verification/${URL}',
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: '4networkinglabs@gmail.com', // using account me and Sam made for networking
            pass: 'networking'
        }
    },

    hashingFunction: myHasher,
    passwordFieldName: 'pw',
}, function(err, options) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});
// -------

// do everything in here! all create/post/update/delete stuff

router.use(function(req, res, next) { // to see when any request is reaching the server
    console.log('Something is happening!');
    next();
});

router.get('/', function(req, res) { // testing purposes
  res.json({message: 'Hello World'});
});

// login existing users
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
      if (usr.password == user.password) {
        console.log("matching!");
        return res.json({success: "true"});
      } else {
        return res.json({success: "false"});
      }

      // gonna ignore this for now...
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

      }) // ----------
    });

}); // --- end of POST /login

// register new users
router.route('/register')

  .post(function(req, res) {

    var email = req.body.username;
    var pass = req.body.password;
    console.log("email: " + email + " pass: " + pass);

    if (req.body.type === 'register') {

        var newUser = new User({
            username: email,
            password: pass,
            collections: []
        });

        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            if (err) {
                return res.status(404).send('ERROR: creating temp user FAILED');
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                console.log('user already exists');
                return res.json({
                    msg: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }

            // new user created
            if (newTempUser) {
                console.log('new temp user created');

                var URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    console.log('sending verification email');
                    res.json({
                        msg: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

            // user already exists in temporary collection!
            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });

    // resend verification button was clicked
    } else {
        nev.resendVerificationEmail(email, function(err, userFound) {
            if (err) {
                return res.status(404).send('ERROR: resending verification email FAILED');
            }
            if (userFound) {
                res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    }
}); // ---- end of POST /register

router.route('/email-verification/:URL')

  .get(function(req, res) {
          var url = req.params.URL;

          nev.confirmTempUser(url, function(err, user) {
              if (user) {
                  console.log("***: " + user.username);
                  nev.sendConfirmationEmail(user.username, function(err, info) {
                      if (err) {
                          return res.status(404).send('ERROR: sending confirmation email FAILED');
                      }
                      res.json({
                          msg: 'CONFIRMED!',
                          info: info
                      });
                  });
              } else {
                  return res.status(404).send('ERROR: confirming temp user FAILED');
              }
          });
}); // ---- end of GET /email-verification/:URL

router.route('/getUsers')
  .get(function(req, res) {
      /*User.create({username: "sarahwhelan@hotmail.ca", password:"hello"}, function(err, instance) {
        if(err)
          console.log()
        console.log("created");
      });*/
      User.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
        res.send(userMap);
    });
  });

app.use('/api', router);

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

module.exports = router;
