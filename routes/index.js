var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
  res.renderData = {};          // render 할 때 보낼 객체
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.renderData['title'] = 'TagTalk';
  res.render('index', res.renderData);
});

module.exports = router;
