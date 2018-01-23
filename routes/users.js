var express = require('express');
var router = express.Router();
var isLogined = require('../middlewares/isLogined');
var request = require('request');
var authServerConfig = require('../config/authServerConfig.json');

router.use(function(req, res, next){

    res.renderData = {};          // render 할 때 보낼 객체
    next();

});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', isLogined, function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    res.render('login', res.renderData);

});

router.post('/login', isLogined, function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    var reqOption = {
        url: ('http://' + authServerConfig.domain + authServerConfig.login),
        method:"POST",
        headers: {
            cookie: JSON.stringify(req.cookies)
        },
        form: req.body
    };

    request(reqOption, function(err, res1, body1){

        var success = JSON.parse(res1.body)['success'];
        var cookie = res1.headers['set-cookie'];

        if(err){
            console.log(err);
            res.json({
                success: false,
                message: "Server ERR"
            })
        }else {

            if(success){

                req.session.destroy();                      // 원래 세션 삭제(로그인 되면 다른 토큰값을 줌;;)
                res.set({'Set-Cookie' : cookie});
                res.json(JSON.parse(body1));

            }else {
                res.json(JSON.parse(body1));
            }
        }
    })

});

router.get('/register', isLogined, function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    res.render('register', res.renderData);

});

router.post('/register', isLogined, function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    var reqOption = {
        url: ('http://' + authServerConfig.domain + authServerConfig.register),
        method:"POST",
        headers: {
            cookie: JSON.stringify(req.cookies)
        },
        form: req.body
    };

    request(reqOption, function(err, res1, body1){

        var success = JSON.parse(res1.body)['success'];
        var cookie = res1.headers['set-cookie'];

        if(err){
            console.log(err);
            res.json({
                success: false,
                message: "Server ERR"
            })
        }else {
            console.log(body1);
            if(success){

                req.session.destroy();                      // 원래 세션 삭제(로그인 되면 다른 토큰값을 줌;;)
                res.set({'Set-Cookie' : cookie});
                res.json(JSON.parse(body1));

            }else {
                res.json(JSON.parse(body1));
            }
        }
    })

})

router.get('/logout', function (req, res, next) {

    req.session.destroy(function(err){

        if(err){
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

module.exports = router;
