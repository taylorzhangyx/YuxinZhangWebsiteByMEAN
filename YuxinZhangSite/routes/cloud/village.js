var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/village', function(req, res, next) {
  res.render('cloud/village');
});


module.exports = router;
