var express = require('express');
var router = express.Router();
var addSessionObj = require('../middlewares/addSessionObj');
var redis = require('redis');
var config = require('../config/waserver');
var client = redis.createClient({
    host: config.redis['host'],
    port: config.redis['port']
});

// client.select(1, function(err) {
//     console.log('session redis select db1');
// });

router.use(function(req, res, next){

  res.renderData = {};          // render 할 때 보낼 객체
  next();

});
router.use(addSessionObj);

/* GET index page. */
router.get('/', function(req, res, next) {

  res.renderData['title'] = 'TagTalk';

  res.render('index', res.renderData);

});


router.get('/auto', function(req,res){

    var word = req.query.word;
    if(word != "") {
        var changedWord = '';
        var lastChar = word[word.length - 1];
        var lastCharPlus = String.fromCharCode(lastChar.charCodeAt(0) + 1);
        var resultArr = [];
        var findArr = [];
        var subValue = '*';

        changedWord = word.substring(0, word.length - 1);
        changedWord += lastCharPlus;

        console.log('input word : ', word);
        console.log('changedWord : ', changedWord);

        word = '[' + word;
        changedWord = '(' + changedWord;

        var query = ["tag", word, changedWord];

         //위에 db1 주석처리 했으므로 select 없어도 됨
        client.ZRANGEBYLEX(query, function (err, result) {
            if (err) {
                console.log('err');
                sentry.message(
                    "Redis get autoComplete error",  //message : 예외
                    "GET /index/auto",             //logger : 어떤 클라이언트에서 예외가 나왔는지
                    {
                        note: "input word:"+word,     //extra : 오류 판별을 위한 다른 정보
                        type: "Redis error"
                    }
                );
                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .append("Access-Control-Allow-Credentials", true)
                    .set()
                    .json({
                        success: false,
                        data: "REDIS error"
                    });
                throw err;
            } else {
                console.log('auto tag in');
                resultArr = result;

                console.log('resultArr :', resultArr);
                console.log('result :', result);
                console.log('result arr length :', resultArr.length);

                for (var i = 0; i < resultArr.length; i++) {
                    if (resultArr[i].indexOf(subValue) != -1) {
                        console.log('find :', resultArr[i]);
                        findArr.push((resultArr[i].split('*'))[0]);
                    }
                }

                console.log('findArr:', findArr);
                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .append("Access-Control-Allow-Credentials", true)
                    .set()
                    .json({
                        success: true,
                        data: findArr
                    });
            }
        });
    }else{
        console.log('word is null');
        res.append("Access-Control-Allow-Origin", "*")
            .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
            .append("Access-Control-Allow-Credentials", true)
            .set()
            .json({
                success: true,
                data: findArr
            });
    }
});

module.exports = router;
