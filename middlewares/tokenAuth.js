var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");        // url 설정해서 db 공간을 바꿀 수 있음

module.exports = function(req, res, next) {

    redisClient.get(req.cookie['connect.sid'], function(err, data){

        if(data == null){       // 토큰 없음

            res.status(401).end();

        } else {

            next();

        }

    });

};