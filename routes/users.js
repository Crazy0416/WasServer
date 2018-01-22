var express = require('express');
var router = express.Router();

router.use(function(req, res, next){

    res.renderData = {};          // render 할 때 보낼 객체
    next();

});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){

  res.renderData['title'] = 'TagTalk';

  res.render('login', res.renderData);

})

module.exports = router;
