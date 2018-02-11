var express = require('express');
var router = express.Router();
var addSessionObj = require('../middlewares/addSessionObj');
var redis = require('redis');
var client = redis.createClient(6379,'localhost');

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

        client.ZRANGEBYLEX(query, function (err, result) {
            if (err) {
                console.log('err');
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
                //res.json(result_json);
                console.log('resultArr :', resultArr);
                console.log('result arr length :', resultArr.length);

                for (var i = 0; i < resultArr.length; i++) {
                    if (resultArr[i].indexOf(subValue) != -1) {
                        console.log('find :', resultArr[i]);
                        findArr.push(resultArr[i]);
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
