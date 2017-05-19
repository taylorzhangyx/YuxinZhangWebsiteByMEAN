var express = require('express');
var router = express.Router();

var village = require('./village');

router.use(village);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yuxin Zhang\'s Site' });
});

module.exports = router;
