
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/loginapp");
autoIncrement.initialize(connection);

var PostSchema = new Schema({
    card_id:{type: String, required: true}, //auto_increment

    title: {type: String, required: true },

    content: {type: String},

    photo_path: {type: String},

    register_time: {type: Date, default: Date.now()},

    user_ObjectId:{type: String},   //type String or ObjectId ? , required: true 추가해야함

    tag:[{
        type:String
    }]
});

// 1씩 증가하는 primary Key를 만든다
// model : 생성할 document 이름
// field : primary key , startAt : 1부터 시작
PostSchema.plugin( autoIncrement.plugin , { model : 'Post', field:'card_id', startAt : 1 });

var Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.createCard = function(newCard, callback) {
    newCard.save(callback);
};

module.exports.modifyCard = function(newCard,check, callback){
    var query = {card_id:check};
    try {
        Post.update(query, {
            $set: {
                title: newCard.title,
                content: newCard.content,
                photo_path: newCard.photo_path,
                tag: newCard.tag,
                register_time: Date.now()
            }
        }, callback);
    }
    catch(e) {
        console.log(e);
    }
};

module.exports.getCardByCardId = function(card_id, callback){
    var query = {card_id:card_id};
    Post.findOne(query, callback);
};

module.exports.getCardById = function(id, callback){
    Post.findById(id, callback);    // mongoose id 있나봄 기본으로
};

module.exports.deleteCardByCardId = function(card_id, callback){
  var query = {card_id:card_id};
  Post.remove(query,callback);
};

// db.posts.find({"user_ObjectId":"5a66d1dd4a116d25902ad2e8"}).sort({"card_id":-1}) 내림차순 정렬해서 전체 뽑기

module.exports.getCardSequence = function(user_ObjectId, number, callback) {
    console.log('getCardSequence function in');

    var query = {user_ObjectId: user_ObjectId};
    var newNumber = parseInt(number);
    console.log('newNumber : ',newNumber);

    Post.find(query,{},{sort:{card_id:-1},limit:10,skip:newNumber}, callback);
    /*
    Post.find(query,{},{sort:{card_id:-1},limit:5,skip:number}, function(err,callback){
        if(err){
            console.log(err);
        }
        res.json('index', {data:data});
    });
    Post.find(query,{},{sort:{card_id:-1},limit:5,skip:newNumber},function(err,callback){
        if(err)  console.log(err);
         console.log(callback);
    });
     */

};
