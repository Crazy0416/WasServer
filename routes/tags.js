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

    // TODO : 레디스에서 인기태그 목록을 받아와서 response

    var hotList = [{
        name: 'Thanks for watch me',
        value: 29
    },{
        name: 'Hello, there!',
        value: 23
    },{
        name: '한글 입력 테스트',
        value: 44
    },{
        name: '워드클라우드',
        value: 54
    },{
        name: '테스트 문자열',
        value: 60
    },{
        name: '태그 문자',
        value: 36
    },{
        name: '채팅방',
        value: 20
    },{
        name: '한글 입력 가능',
        value: 20
    },{
        name: 'English Okay',
        value: 12
    }];


    res.json(hotList);
});

module.exports = router;