var express = require('express');
var router = express.Router();
var addSessionObj = require('../middlewares/addSessionObj');

router.use(function(req, res, next){

  res.renderData = {};          // render 할 때 보낼 객체
  next();

});
router.use(addSessionObj);

/* GET index page. */
router.get('/', function(req, res, next) {

  res.renderData['title'] = 'TagTalk';

  res.render('index', res.renderData);

});


module.exports = router;
