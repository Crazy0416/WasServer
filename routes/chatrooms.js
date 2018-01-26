var express = require('express');
var router = express.Router();
var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");
var hosts = require('../config/hosts.json');

router.use(function(req, res, next){
    res.renderData = {};          // render 할 때 보낼 객체
    next();
});

var promise1 = new Promise(function (resolve, reject) {



});

/*
* GET /chatroom/:tag/:id?
* Render chatroom page
 */
router.get('/:tag', function(req, res, next){
    var tag = req.params.tag;
    res.renderData['title'] = tag+"방";

    redisClient.select('1', function(err1, val1){

        if(err1){
            res.render('error', {
                message: "DB SELECT ERR",
                error: {
                    status: 500,
                    stack: "...."
                }
            })
        } else{

            redisClient.keys('*', function (err2, chatServer) {     // chatServer : 서버 <ip:port> 리스트

                redisClient.mget(chatServer, function(err3, channelCntArray){

                    // channelCntArrayInt : 서버에 접속한 사람들의 수 리스트
                    var channelCntArrayInt = channelCntArray.map(function (x) {
                        return parseInt(x, 10);
                    });
                    var min = channelCntArrayInt.reduce( function (previous, current) {
                        return previous > current ? current:previous;
                    });
                    var A_index = channelCntArrayInt.indexOf(min);

                    res.renderData['chatServerAdress'] = chatServer[A_index];

                    redisClient.set(chatServer[A_index], channelCntArrayInt[A_index]+1);

                    res.render('chatroom', res.renderData);

                });

            })

        }

    });

    // TODO: 채팅 채널에 인원수 증가


})

module.exports = router;