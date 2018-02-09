// var express = require('express');
// var router = express.Router();
// var redis = require('redis');
// var client = redis.createClient(6379,'localhost');
// var addSessionObj = require('../middlewares/addSessionObj');
//
// client.select(1, function(err) {
//     console.log('session redis select db1 for autoComplete');
// });
//
// router.use(function(req, res, next){
//
//     res.renderData = {};          // render 할 때 보낼 객체
//     next();
//
// });
// router.use(addSessionObj);
//
// router.get('/auto', function(req,res){
//
//     var word = req.query.word;
//     var lastChar = word[word.length-1];
//     var lastCharPlus = lastChar.charCodeAt(0)+1;
//
//     //client.ZRANGEBYLEX("tag", [lastChar , ( );
//
//
//     var test = 'h';
//     var test2 = 104;
//
//     console.log('%s', test);
//     console.log('h : %d', test.charCodeAt(0));
//     console.log('h+1 : %d', test.charCodeAt(0)+1);
//     console.log('h : %s', String.fromCharCode(test2));
//     console.log('i : %s', String.fromCharCode(test2+1));
//     console.log('i : %s', String.fromCharCode(test+1));
//
//
//
// });
//
// module.exports = router;