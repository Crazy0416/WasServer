var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config/waserver');
mongoose.connect('mongodb://' + config.mongodb['host'] +'/loginapp');
var redis = require('redis');
var client = redis.createClient({
    host: config.redis['host'],
    port: config.redis['port']
});
var path = require('path');
var multer = require('multer');
var mult_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images/uploads'));
    },
    filename: function(req, file, cb){
        cb(null, req.session.uid  + '-' + Date.now() + '-' + file.originalname);
    }
});
var sentry = require('../common/sentry');
var logging = require('../common/log');

// middleware function
var tokenAuth = require('../middlewares/tokenAuth');
var addSessionObj = require('../middlewares/addSessionObj');
var upload= multer({
    storage: mult_storage
});


// models
var User = require('../models/user');   //user schema 얻어오기 위함
var Post = require('../models/post');    //post schema 얻어오기 위함
var Tag = require('../models/tag');  //tag schema


router.use(function(req, res, next){
    res.renderData = {};          //
    // 할 때 보낼 객체
    next();
});

/* GET card page.*/
router.get('/:card_id', addSessionObj, function(req, res, next) {
    var card_id = req.params['card_id'];

    Post.getCardById(card_id, function(err, card){
        if(err){

            res.render({
                message: "DB ERROR",
                error: {
                    status: 500,
                    stack: "..."
                }
            })

        }else {
            res.renderData['title'] = card.title;
            res.renderData['postImageUrl'] = card.photo_path;
            res.renderData['postContent'] = card.content;
            res.renderData['postTag'] = card.tag;
            res.render('card', res.renderData);
        }
    });

});

router.get('/', tokenAuth, function(req,res){

    var user_ObjectId = req.session['passport']['user'];
    var number = req.query.number;

    console.log('user_ObjectId: ', user_ObjectId);
    console.log('number :', number);
    console.log('req cookie : ' + JSON.stringify(req.cookies));

    Post.getCardSequence(user_ObjectId,number,function(err,card){
        console.log('here!!!');
        if(err) {
            console.log('GET /posts/card getCardSequence ERROR: ' + err);
            sentry.message(
                "DB getCardSequenct error",
                "GET /users_card",
                {
                    note: "user_ObjectId:"+user_ObjectId,
                    type: "DB error"
                }
            );
            res.append("Access-Control-Allow-Origin", "*")
                .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                .set()
                .json({
                    success:false,
                    message:'DB getCardSequence error'
                });
            throw err;
        } else {
            console.log('GET /users/card getCardSequence card Array : ' + JSON.stringify(card));
            console.log('GET /users/card getCardSequence card Array length: ' + card.length);
            var cardArr=[];

            for(var i=0; i<card.length; i++){
                cardArr.push({
                    ObjectId: card[i]._id,
                    user_ObjectId:card[i].user_ObjectId,
                    card_id:card[i].card_id,
                    title:card[i].title,
                    content:card[i].content,
                    photo_path:card[i].photo_path,
                    register_time:card[i].register_time,
                    tag:card[i].tag
                })
            }
            console.log('card return end');
            res.append("Access-Control-Allow-Origin", "*")
                .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                .append("Access-Control-Allow-Credentials", true)
                .set()
                .json({
                    success: true,
                    data: cardArr
                });
        }
    })
});

/*
    card 저장/갱신
*/
router.post('/', tokenAuth, upload.single('photo'), function(req,res){

    console.log('/posting/card in');
    console.log("req.file: " + JSON.stringify(req.file));
    console.log("body: " + JSON.stringify(req.body));

    var newCard = new Post({
        title: req.body.title,
        content: req.body.content,
        user_ObjectId: req.session['passport']['user'],

        tag: req.body.tag.split(' ')
    });
    // TODO : 이미지 레플리케이션 설정
    if(req.file){
        newCard.photo_path = '/images/uploads/' + req.file.filename;
    }else{
        newCard.photo_path = '/images/noimage.jpg';
    }

    var check = parseInt(req.body.card_id);
    console.log('POST /posts/card mode check = ', check);
    console.log('newCard: ' + newCard);
    console.log('newCard JSON: ' + JSON.stringify(newCard));
    if(check == 0){   //create and save
        Post.createCard(newCard, function(err,card){
            if(err){
                sentry.message(
                    "DB createCard error",  //message : 예외
                    "POST /users_card",             //logger : 어떤 클라이언트에서 예외가 나왔는지
                    {
                        note: "newCard:"+newCard,     //extra : 오류 판별을 위한 다른 정보
                        type: "DB error"
                    }
                );
                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success:false,
                        message:'DB createCard error'
                    });
                throw err;
            }else{
                var card_ObjectId = card._id.toString();
                console.log('card_ObjectId : ',card_ObjectId);
                console.log('tags input DB');
                /* tags 디비에 추가*/
                for(var i=0; i<newCard.tag.length; i++){
                    console.log('tag name :',newCard.tag[i]);
                    Tag.createOrUpdateTagCount(newCard.tag[i], function(err,result){
                        if(err){
                            sentry.message(
                                "DB createOrUpdateTagCount error",  //message : 예외
                                "POST /users_card",             //logger : 어떤 클라이언트에서 예외가 나왔는지
                                {
                                    note: "card_ObjectId:"+card_ObjectId,     //extra : 오류 판별을 위한 다른 정보
                                    type: "DB error"
                                }
                            );
                            console.log('err');
                            res.append("Access-Control-Allow-Origin","*")
                                .append("Access-Control-Allow-Headers","origin, x-requested-with, content-type, accpet")
                                .set()
                                .json({
                                    success:false,
                                    message:'DB inputTag error'
                                });
                            throw err;
                        }else{
                            console.log('input tag success');
                        }
                    });
                }

                /* tags redis에 추가 */
                console.log('tag : ', newCard.tag);
                console.log('tag lengthL:', newCard.tag.length);
                console.log('tage name : ', newCard.tag[0]);

                //redis에 저장할 카드 객체
                var redis_card = {
                    title: newCard.title,
                    content: newCard.content,
                    photo_path: newCard.photo_path,
                    tag: newCard.tag,
                    card_ObjectId: card_ObjectId
                };
                console.log('redis-card : ', redis_card);

                for(var i=0; i<newCard.tag.length; i++){
                    var key = redis_card.tag[i];
                    var value = redis_card;

                    console.log('key : ', key);
                    console.log('value :', value);
                    client.lpush(key,JSON.stringify(value), function(err){  //JSON을 문자열 객체로 변환하여 레디스에 삽입
                        if(err){
                            sentry.message(
                                "Redis input card error",
                                "POST /uses_card",
                                {
                                    note: "key(tag)"+key,
                                    type: "Redis error"
                                }
                            );
                            res.append("Access-Control-Allow-Origin","*")
                                .append("Access-Control-Allow-Headers","origin, x-requested-with, content-type, accpet")
                                .set()
                                .json({
                                    success:false,
                                    message:'Redis push error'
                                });
                            throw err;
                        }else{
                            console.log('lpush success');

                            console.log('key : ', key);
                            console.log('key length : ', client.llen(key)); //왜 이게 true가 나올까?

                            client.ltrim(key, 0, 100, function (err) {   //0~100범위 밖 index들 삭제
                                if (err) {
                                    sentry.message(
                                        "Redis trim card error",
                                        "POST /users_card",
                                        {
                                            note: "key(tag)"+key,
                                            type: "Redis error"
                                        }
                                    );
                                    res.append("Access-Control-Allow-Origin", "*")
                                        .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accpet")
                                        .set()
                                        .json({
                                            success: false,
                                            message: 'Redis trim error'
                                        });
                                    throw err;
                                } else {
                                    console.log('ltrim success');

                                }
                            });
                        }
                    });
                }
                res.append("Access-Control-Allow-Origin","*")
                    .append("Access-Control-Allow-Headers","origin, x-requested-with, content-type, accpet")
                    .set()
                    .json({
                        success:true,
                        data:{
                            card_id:card.card_id
                        }
                    });
            }
        });
        logging.info('WHAT new Card Tags :' + newCard.tag);
        console.log('new card save success');
    }else if(check != 0){ //modify

        Post.modifyCard(newCard,check,function(err,card){
            if(err){
                sentry.message(
                    "DB modifyCard error",
                    "POST /users_card",
                    {
                        note: "newCard"+newCard,
                        type: "Redis error"
                    }
                );
                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success:false,
                        message:'DB modifyCard error'
                    });
                throw err;
            }else{
                console.log('modified card : ',card);

                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success:true,
                        data:{
                            card_id:check
                        }
                    });
            }
        });
    }
});

/*
    card 삭제
*/
router.delete('/', function(req,res){
    //var user_ObjectId = req.body.user_ObjectId;
    var card_id = req.body.card_id;

    Post.getCardByCardId(card_id, function(err,card){

        if(err){
            sentry.message(
                "DB getCardByCardId error",
                "DELETE /users_card",
                {
                    note: "card_id"+card_id,
                    type: "DB error"
                }
            );
            res.append("Access-Control-Allow-Origin", "*")
                .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                .set()
                .json({
                    success:false,
                    message:'DB getCardByCardId error'
                });
            throw err;
        }else {
            if (!card) {
                res.append("Access-Control-Allow-Origin", "*")
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success: false,
                        message: 'DB there is no card'
                    });
            }else{
                Post.deleteCardByCardId(card_id,function(err,card){
                    if(err){
                        sentry.message(
                            "DB deleteCardByCardId card error",
                            "DELETE /users_card",
                            {
                                note: "card_id"+card_id,
                                type: "DB error"
                            }
                        );
                        res.append("Access-Control-Allow-Origin", "*")
                            .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                            .set()
                            .json({
                                success:false,
                                message:'DB deleteCardByCardId error'
                            });
                        throw err;
                    }else{
                        res.append("Access-Control-Allow-Origin", "*")
                            .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                            .set()
                            .json({
                                success:true,
                                message:card_id
                            });
                    }
                })
            }
        }
    })
});

module.exports = router;