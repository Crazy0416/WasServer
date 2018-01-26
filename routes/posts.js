var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
    res.renderData = {};          // render 할 때 보낼 객체
    next();
});

router.get('/page/:card_id', function(req, res, next){

    // TODO: 몽고 디비에서 데이터 추출해야함

    res.renderData['title'] = "테스트 맨!";

    res.render('post', res.renderData);

});

module.exports = router;