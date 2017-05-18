var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yuxin Zhang\'s Site' });
});

router.get('/profile', function(req, res, next) {
  res.render('main/profile');
});

module.exports = router;
