var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
    res.renderData = {};          // render 할 때 보낼 객체
    next();
});

/*
* GET /chatroom/:tag/:id?
* Render chatroom page
 */
router.get('/hotlist', function(req, res, next){

    var hotList = [{
        name: 'Thanks for watch me',
        value: 29
    },{
        name: 'Hello, there!',
        value: 23
    },{
        name: '님아 한글 가능??',
        value: 44
    },{
        name: '완전 가능',
        value: 54
    },{
        name: '요호 개꿀띠',
        value: 60
    },{
        name: '특수 문자 가능??',
        value: 36
    },{
        name: '앙 기모띠@@@@@@!@#!@#',
        value: 20
    },{
        name: '헐 쩔었다',
        value: 20
    },{
        name: 'watch me',
        value: 12
    }];


    res.json(hotList);
});

module.exports = router;