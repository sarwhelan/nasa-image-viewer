var express = require('express');
var router = express.Router();

/* to index.html page */
router.get('/', function(req, res, next) {
  res.render('/../../client/src/index.html');
});

module.exports = router;
