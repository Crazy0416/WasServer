var express = require('express');
var router = express.Router();
var isLogined = require('../middlewares/isLogined');
var request = require('request');
var authServerConfig = require('../config/authServerConfig.json');
var uidParamAuth = require('../middlewares/uidParamAuth');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");        // url 설정해서 db 공간을 바꿀 수 있음

router.use(function(req, res, next){

    res.renderData = {};          // render 할 때 보낼 객체
    next();

});
router.use(isLogined);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    res.render('login', res.renderData);

});

router.get('/register', function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    res.render('register', res.renderData);

});

router.get('/logout', function (req, res, next) {

    redisClient.del("sess:"+ req.cookies.token,function(err, val){

        if(err || val==0){
            res.json({
                success: false,
                message: "로그아웃 오류!"
            })
        } else{
            res.json({
                success: true,
                message: "로그아웃 완료!!"
            })
        }

    });

});

// uid와 세션의 uid가 일치하는 지 middleware로 검사
//
router.get('/mypage/:uid', uidParamAuth, function(req, res, next){

    res.renderData['title'] = 'TagTalk';
    res.renderData['uid'] = req.session.uid;
    res.renderData['email'] = req.session.email;          // TODO: AuthServer 업데이트 되면 처리

    //TODO: 유저가 작성한 포스트를 vue로 처리

    res.render('myPage', res.renderData);

});

router.get('/card/:card_id', function(req, res, next){

    // TODO: 몽고 디비에서 데이터 추출해야함

    res.renderData['title'] = "테스트 맨!";

    res.render('post', res.renderData);

});

router.get('/writeCard', function(req, res, next){

    // TODO: 몽고 디비에서 데이터 추출해야함

    res.renderData['title'] = "포스트 작성 페이지";

    res.render('writeCard', res.renderData);

});

module.exports = router;