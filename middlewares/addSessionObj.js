var redis = require('redis');
var redisClient = redis.createClient(6379, "127.0.0.1");        // url 설정해서 db 공간을 바꿀 수 있음

module.exports = function(req, res, next) {

    console.log('req cookie: ' + JSON.stringify(req.cookies));

    if(req.cookies['token'] === undefined){
        next();

    } else {

        redisClient.get("sess:"+ req.cookies.token, function(err, val){

            if(val !== null) {       // 토큰 있음

                req.session = JSON.parse(val);                              // 세션처럼 사용하기 위해
                res.renderData['uid'] = req.session.uid;
                console.log('req session: ' + JSON.stringify(req.session));
                next();

            } else {
                console.log("req session uid: no find");
                next();

            }
        });
    }
};