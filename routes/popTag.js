var express = require('express');
var router = express.Router();
var addSessionObj = require('../middlewares/addSessionObj');
var Tag = require('../models/tag');  //tag schema
var sentry = require('../common/sentry');
var request = require('request');

router.use(function(req, res, next){

    res.renderData = {};          // render 할 때 보낼 객체
    next();

});
router.use(addSessionObj);

/* GET popTag page. */
router.get('/', function(req, res, next){

    res.renderData['title'] = 'TagTalk';

    res.render('popTag', res.renderData);

});


/*
* GET hotList array
 */
router.get('/hotlist', function(req, res, next){

    var options = {
        url: 'http://192.168.0.15/chatserver/popularChat',
        method: 'GET',
    }

    request(options, function(error, response, body){
        if(!error && response.statusCode == 200){
            console.log('popTag body:',body);
        }
    });


    // TODO : 레디스에서 인기태그 목록을 받아와서 response

    var hotList = [{
        name: '테스트',
        value: 12
    },{
        name: '바보바보',
        value: 24
    },{
        name: '메롱메롱',
        value: 45
    },{
        name: '하이루',
        value: 22
    },{
        name: '켁케케',
        value: 50
    },{
        name: '헐',
        value: 30
    },{
        name: '하이루',
        value: 16
    },{
        name: '메롱옹옹',
        value: 20
    },{
        name: '하이룽룽룽',
        value: 20
    }];

    res.append("Access-Control-Allow-Origin", "*")
        .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
        .set()
        .json(hotList);
});

/*
 * 오늘의 인기태그 10개 뽑기 (하루에 한번씩 삭제됨), 삭제 전에 파일에 옮겨쓰기 추가하면 좋을듯
 */
router.get('/todayList', function(req,res){
    console.log('get/todayList in');

    Tag.popListTag(function(err,result){
        if(err){
            sentry.message(
                "DB popListTag error",
                "GET popTag/todayList",
                {
                    type: "DB error"
                }
            );
            console.log('err');
        }else{
            console.log('pop list result :',result);
            res.json({
                success:true,
                data:result
            });
        }
    })

});

module.exports = router;