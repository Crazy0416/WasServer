var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");        // url 설정해서 db 공간을 바꿀 수 있음

module.exports = function(req, res, next) {

    redisClient.get(req.cookies['token'], function(err, data){

        if(data == null){       // 토큰 없음

            next();

        } else {

            res.render('error', {
                message: "이미 로그인되어 있습니다.",
                error: {
                    status: 201,
                    stack: ""
                }
            })

        }
    });

};