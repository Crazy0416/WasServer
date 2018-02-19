var express = require('express');
var router = express.Router();
var addSessionObj = require('../middlewares/addSessionObj');
var Tag = require('../models/tag');  //tag schema
var sentry = require('../sentry');

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

    // TODO : 레디스에서 인기태그 목록을 받아와서 response
    var List = Tag.popListTag();
    console.log('List :', List);

    var hotList = [{
        name: List[0].tag_name,
        value: List[0].count
    },{
        name: List[1].tag_name,
        value: List[1].count
    },{
        name: List[2].tag_name,
        value: List[2].count
    },{
        name: List[3].tag_name,
        value: List[3].count
    },{
        name: List[4].tag_name,
        value: List[4].count
    },{
        name: List[5].tag_name,
        value: List[5].count
    },{
        name: List[6].tag_name,
        value: List[6].count
    },{
        name: List[7].tag_name,
        value: List[7].count
    },{
        name: List[8].tag_name,
        value: List[8].count
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