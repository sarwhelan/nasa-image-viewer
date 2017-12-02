var User = require('../models/user');
var Collection = require ('../models/collection');
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
        return res.json({msg: "unsucessful"});
      }
      /*
      if (usr.password == user.password) {
        console.log("matching!");
        return res.json({msg: 'success'});
      } else {
        return res.json({msg: 'unsuccessful'});
      }
      */
      bcrypt.compare(usr.password, user.password, function(err, correct) {
        if(err)
          return res.send(err);
        else if(!correct) {// not matching
          console.log("passwords don't match");
          return res.json({msg: "unsuccessful"});
        }
        else { // passwords match
          console.log("user login successful");
          return res.json({msg: "success"});
        }

      })
    });
}); // --- end of POST /login
// END OF /login route ---------------------------------------------------------

// register new users
router.route('/register')

  .post(function(req, res) {

    email = validator.escape(req.body.username);
    pass = validator.escape(req.body.password);
    console.log("email: " + this.email + " pass: " + this.pass);

    if(!validator.isEmail(this.email)) {
      return res.json({msg: "invalidEmail"});
    }

    if (req.body.type === 'register') {

        /*var newUser = new User({
            username: email,
            password: pass,
            collections: []
        });*/

        User.findOne({username: this.email}, function(err, result) {
          if(err) {
            return res.json({msg: "error"});
          }
          if(result) {
            return res.json({msg: "taken"});
          }
          bcrypt.genSalt(8, function(err, salt) {
            bcrypt.hash(this.pass, salt, function(err, hash) {
              if(err) {
                console.log(err);
                return res.json({msg: "error"});
              }
              // set the password to the hash so we aren't storing it directly
              this.pass = hash;
              console.log(this.pass);
              User.create({username: this.email, password: this.pass}, function(err, instance) {
                if(err) {
                  return res.json({msg: "error"});
                }
                else {
                  return res.json({msg: "success"});
                }
              })
            })
          })
        })
      }

        /*
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
  } /* else {
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
    } */
}); // ---- end of POST /register
// END OF /register route ------------------------------------------------------

router.route('/email-verification/:URL') // this isn't working

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
// END OF /email-verification:URL route ----------------------------------------


// returns list of all users in the system along with their hashed password
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
  }); // ---- end of GET /getUsers
// END OF /getUsers/ route -----------------------------------------------------

// for admin user to take down accounts, part of DMCA
router.route('/removeUser/:id')
  .delete(function(req, res) {
    bye = req.params.id;
    User.remove({_id: bye}, function(err) {
      if(err) {
        console.log("not deleted!");
        return res.json({msg: 'woooops'});
      }
      else {
        res.json({msg: 'wahooo'});
      }
    });
  }); // end of DELETE /removeUser/:id
// END OF /removeuser/:id route ------------------------------------------------

// get stuff related to image collections
router.route('/collections')

  // GET ALL COLLECTIONS
  .get(function(req, res) {
    Collection.find({}, function(err, collections) {
      var collectionMap = {};
      collections.forEach(function(collection) {
        collectionMap[collection._id] = collection;
      });
      res.send(collectionMap);
    })
  }) // ---- end of GET /collections

  // CREATE A NEW COLLECTION
  .post(function(req, res) {
    console.log("ugh" + req.body.name + req.body.description);
    owner = req.body.owner;
    name = validator.escape(req.body.name);
    description = validator.escape(req.body.description);
    visibility = req.body.visibility;
    imgLinks = req.body.imgLinks;
    rating = req.body.rating;

    var newCollection = new Collection({
      owner: this.owner,
      name: this.name,
      description: this.description,
      visibility: this.visibility,
      imgLinks: this.imgLinks,
      rating: this.rating
    })

    Collection.create(newCollection, function(err, instance) {
      if(err) {
        console.log("new collection not created");
        return res.json({msg: "unsuccessful"});
      }
      if(instance) {
        console.log("collection created");
        return res.json({msg: "success"});
      }
    })

  }) // ---- end of POST /collections
// END OF /collections route ---------------------------------------------------

router.route('/collections/:x') // in DELETE, x is collection ID, in GET, x is username
  .delete(function(req, res) { //  DELETE A COLLECTION BASED ON COLLECTION _ID
    id = req.params.x;
    Collection.remove({_id: id}, function(err, resp) {
      if(err){
        console.log("error in deleting individual collection");
        return res.json({msg: "unsuccessful"});
      }
      else {
        console.log("deleted collection");
        return res.json({msg: "success"});
      }
    })
  }) // ---- end of DELETE /collections:x

  .get(function(req, res) { // GET TOP 10 COLLECTIONS OR ALL COLLECTIONS BY A SPECIFIED USER IF x == ten
    if (req.params.x == "ten") { // IF GETTING TOP 10...
      Collection.find({visibility: 'public'}).sort({rating: -1}).limit(10).exec(function(err, collections) {
        if(err) {
          return res.json({msg: "unsuccessful"});
          console.log("error in getting top 10");
        }
        var collectionMap = {};
        collections.forEach(function(collection) {
          collectionMap[collection._id] = collection;
        });
        return res.send(collectionMap);
      })
    }
    else {
      username = req.params.x;
      Collection.find({owner: username}, function(err, collections) {
        var collectionMap = {};
        collections.forEach(function(collection) {
          collectionMap[collection._id] = collection;
        });
        res.send(collectionMap);
      })
    }
  });
// END OF /collections/:x route ------------------------------------------------

router.route('/collectionInfo/:id')
  .get(function(req, res) {
    id = req.params.id;
    Collection.find({_id: id}, function(err, collection) {
      if(err) {
        console.log("error getting imgs in collection");
        res.json({msg: "unsuccessful"});
      } else {
        console.log(collection);
        res.send(collection);
      }
    })
  })

  .put(function(req, res) {
    id = req.params.id;
    name = req.body.name;
    desc = req.body.desc;
    imgs = req.body.imgs; // account for adding and deleting imgs
    vis = req.body.vis;
    Collection.update({_id: id},
      {name: this.name, description: this.desc, visibility: this.vis, imgLinks: this.imgs},
      function(err, resp) {
        if(err) {
          console.log("couldn't update");
          res.json({msg: "unsuccessful"});
        }
        else res.json({msg: "success"});
      })
  })

// initial route for all routes is /api
app.use('/api', router);

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

module.exports = router;
