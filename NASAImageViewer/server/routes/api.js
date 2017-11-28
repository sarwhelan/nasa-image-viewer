var express = require('express');
var router = express.Router();

// do everything in here! all create/post/update/delete stuff here


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
