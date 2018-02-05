var express = require('express');
var router = express.Router();
var path = require('path');
var pubIp = require('../config/pubIp');
var multer = require('multer');
var mult_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images/uploads'));
    },
    filename: function(req, file, cb){
        cb(null, req.session.uid  + '-' + Date.now() + '-' + file.originalname);
    }
});

// middleware function
var tokenAuth = require('../middlewares/tokenAuth');
var addSessionObj = require('../middlewares/addSessionObj');
var upload= multer({
    storage: mult_storage
});



// models
var User = require('../models/user');   //user schema 얻어오기 위함
var Post = require('../models/post');    //post schema 얻어오기 위함

router.use(function(req, res, next){
    res.renderData = {};          //
    // 할 때 보낼 객체
    next();
});

/* GET card page.*/
router.get('/:card_id', addSessionObj,function(req, res, next){
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

    console.log('/posting/card get in');
    var user_ObjectId = req.session['passport']['user'];
    var number = req.query.number;

    console.log('user_ObjectId: ', user_ObjectId);
    console.log('number :', number);
    console.log('req cookie : ' + JSON.stringify(req.cookies));

    Post.getCardSequence(user_ObjectId,number,function(err,card){
        console.log('here!!!');
        if(err){
            console.log('GET /posts/card getCardSequence ERROR: ' + err);
            res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                .set()
                .json({
                    success:false,
                    message:'DB getCardSequence error'
                });
            throw err;
        }else {
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
            // console.log(cardArr);
            console.log('card return end');
            res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
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

    if(check == 0){   //create and save
        Post.createCard(newCard, function(err,card){
            if(err){
                res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success:false,
                        message:'DB createCard error'
                    });
                throw err;
            }else{
                console.log('create card : ',card);
                var card_ObjectId = card._id.toString();
                console.log('card_ObjectId : ',card_ObjectId);
                console.log('new card save success');

                res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success:true,
                        data:{
                            card_id:card.card_id
                        }
                    });
            }
        });
    }else if(check != 0){ //modify

        Post.modifyCard(newCard,check,function(err,card){
            if(err){
                res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success:false,
                        message:'DB modifyCard error'
                    });
                throw err;
            }else{
                console.log('modified card : ',card);

                console.log('card modify success');

                res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
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
            res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                .set()
                .json({
                    success:false,
                    message:'DB getCardByCardId error'
                });
            throw err;
        }else {
            if (!card) {
                res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                    .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                    .set()
                    .json({
                        success: false,
                        message: 'DB there is no card'
                    });
            }else{

                Post.deleteCardByCardId(card_id,function(err,card){
                    if(err){
                        res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
                            .append("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept")
                            .set()
                            .json({
                                success:false,
                                message:'DB deleteCardByCardId error'
                            });
                        throw err;
                    }else{
                        res.append("Access-Control-Allow-Origin", "http://" + pubIp.domain)
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