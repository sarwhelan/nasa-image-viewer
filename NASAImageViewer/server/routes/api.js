var User = require('../models/user');
var validator = require('validator');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var app = express();

// do everything in here! all create/post/update/delete stuff

router.get('/', function(req, res) {
  res.json({message: 'Hello World'});
});

// login
router.route('/login')

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

app.use('/api', router);
app.listen(8080);

module.exports = router;
