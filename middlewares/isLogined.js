var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");        // url 설정해서 db 공간을 바꿀 수 있음

module.exports = function(req, res, next) {

    if(req.session !== undefined){       // 토큰 있음

        if(req.session.uid){

            res.renderData['uid'] = req.session.uid;
            next();

        }else {
            next();
        }

    } else {
        next();
    }

};