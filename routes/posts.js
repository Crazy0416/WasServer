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
var upload= multer({
    storage: mult_storage
});

// models
var User = require('../models/user');   //user schema 얻어오기 위함
var Post = require('../models/post');    //post schema 얻어오기 위함

router.use(function(req, res, next){
    res.renderData = {};          // render 할 때 보낼 객체
    next();
});

router.get('/card', tokenAuth, function(req,res){

    console.log('/posting/card get in');
    var user_ObjectId = req.query.user_ObjectId;
    var number = req.query.number;

    console.log('user_ObjectId: ', user_ObjectId);
    console.log('number :', number);

    Post.getCardSequence(user_ObjectId,number,function(err,card){
        if(err){
            console.log('getCardSequence error');
            res.json({
                    success:false,
                    message:'DB getCardSequence error'
                });
            throw err;
        }else {
            console.log('!!!!!getCardSequenct in');
            var cardArr=[];

            for(var i=0; i<card.length; i++){
                cardArr.push({
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
            res.json({
                    success: true,
                    data: cardArr
                });
            console.log('card return end');
        }
    })
});

/*
    card 저장/갱신
*/
router.post('/card', tokenAuth, upload.single('photo'), function(req,res){

    console.log('/posting/card in');
    console.log("req.file: " + JSON.stringify(req.file));
    console.log("body: " + JSON.stringify(req.body));
    console.log('file name : ' + req.file.destination);

    var newCard = new Post({
        title: req.body.title,
        content: req.body.content,
        user_ObjectId: req.session['passport']['user'],
        photo_path: pubIp + '/images/uploads/' + req.file.filename,
        tag: req.body.tag.split(' ')
    });
    var check = parseInt(req.body.card_id);
    console.log('POST /posts/card mode check = ', check);

    if(check == 0){   //create and save
        Post.createCard(newCard, function(err,card){
            if(err){
                res.json({
                        success:false,
                        message:'DB createCard error'
                    });
                throw err;
            }else{
                console.log('create card : ',card);
                var card_ObjectId = card._id.toString();
                console.log('card_ObjectId : ',card_ObjectId);
                console.log('new card save success');

                res.json({
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
                res.json({
                        success:false,
                        message:'DB modifyCard error'
                    });
                throw err;
            }else{
                console.log('modified card : ',card);

                console.log('card modify success');

                res.json({
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
router.delete('/card', function(req,res){
    //var user_ObjectId = req.body.user_ObjectId;
    var card_id = req.body.card_id;

    Post.getCardByCardId(card_id, function(err,card){

        if(err){
            res.json({
                    success:false,
                    message:'DB getCardByCardId error'
                });
            throw err;
        }else {
            if (!card) {
                res.json({
                        success: false,
                        message: 'DB there is no card'
                    });
            }else{

                Post.deleteCardByCardId(card_id,function(err,card){
                    if(err){
                        res.json({
                                success:false,
                                message:'DB deleteCardByCardId error'
                            });
                        throw err;
                    }else{
                        res.json({
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