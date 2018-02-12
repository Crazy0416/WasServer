var express = require('express');
var router = express.Router();
var addSessionObj = require('../middlewares/addSessionObj');
var uidParamAuth = require('../middlewares/uidParamAuth');
var tokenAuth = require('../middlewares/tokenAuth');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");        // url 설정해서 db 공간을 바꿀 수 있음

var Post = require('../models/post');    //post schema 얻어오기 위함

router.use(function(req, res, next){

    res.renderData = {};          // render 할 때 보낼 객체
    next();

});
router.use(addSessionObj);

/* GET login page. */
router.get('/login', function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    res.render('login', res.renderData);

});

/* GET register page. */
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

/* GET popTag page.
* middleware:
*       uidParamAuth: req.params.uid가 인증된 사용자와 일치하는 지 확인
*/
router.get('/userProfile/:uid', uidParamAuth, function(req, res, next){

    res.renderData['title'] = 'TagTalk';
    res.renderData['uid'] = req.session.uid;
    res.renderData['email'] = req.session.email;          // TODO: AuthServer 업데이트 되면 처리

    //TODO: 유저가 작성한 포스트를 vue로 처리

    res.render('userProfile', res.renderData);

});

/* GET editCard page.*/
router.get('/userProfile/:uid/editCard', tokenAuth, function(req, res, next){

    // TODO: 몽고 디비에서 데이터 추출해야함

    res.renderData['title'] = "포스트 작성 페이지";

    res.render('editCard', res.renderData);

});


module.exports = router;