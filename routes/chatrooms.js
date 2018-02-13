var express = require('express');
var router = express.Router();
var redis = require('redis');
var config = require('../config/waserver');
var redisClient = redis.createClient({
    host: config.redis['host'],
    port: config.redis['port']
});
var addSessionObj = require('../middlewares/addSessionObj');

router.use(function(req, res, next){
    res.renderData = {};          // render 할 때 보낼 객체
    next();
});
router.use(addSessionObj);

var Post = require('../models/post');    //post schema 얻어오기 위함

/*
 * GET chatroom page
 */
router.get('/tag/:tag', function(req, res, next){
    var tag = req.params.tag;
    res.renderData['title'] = tag+"방";
    res.cookie('tagName', tag);

    res.render('chatroom', res.renderData);

    /*
        자동완성을 위해 레디스에 검색값 집어넣기
     */
    console.log('redis tag in');
    tag = tag+'*';
    console.log('tag+* : ', tag);
    var input ='';
    for(var i=0; i<tag.length; i++){
        input = input + tag[i];
        console.log('input value : ', input);
        redisClient.ZADD("tag",0,input,function(err,result){
            if(err){
                console.log('error');
                return;
            }else{
                console.log('input success');
            }
        })
    }
    /*
    count(score)를 넣으면 그때 하기
    //tag = tag+'*';
    redisClient.ZINCRBY("tag", 1, tag, function(err, result){
        if(err){
            console.log("error");
            return;
        }else{
            console.log('tag+* in');
            var result_json = {};
            result_json["result"] = result;
            //res.json(result_json);
            console.log(result_json);
        }

    });
    */

    // TODO: 채팅 채널에 인원수 증가
});


/*
 * 채팅방 이름(tag) 받아서 포스팅 보여주기 / redis 모든 함수 콜백 지원
 * req : #을 제외한 태그(채팅방)이름
 * res : 그 채팅방에 있는 포스팅들 json형식 (개수 정해서 보낼 수 있음)
 */

router.get('/cardList', function(req,res){

    console.log('chat/cardList in');
    var dataList = [];
    var tag = req.query.tag;
    tag = '#'+tag;
    client.LLEN(tag, function(err,result){
        var length = result;
        console.log('tag(chatroom) name:',tag);
        console.log('chatroom length:',length);
        client.LRANGE(tag,1,length, function(err, result) {
            if(err){
                console.log('redis error');
                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accpet")
                    .set()
                    .json({
                        success: false,
                        message: 'Redis trim error'
                    });
                throw err;
            }else{
                dataList = result;
                console.log('(card)dataList: ', dataList);
                res.json({
                    success:true,
                    data:dataList
                });
            }
        });
    });
});




module.exports = router;