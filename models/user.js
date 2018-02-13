var config = require('../config/waserver');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Post = require('./post');
var Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
    uid: {
         type: String,
         index: true,
         unique: true
    },
    password: {
         type: String
    },
    email: {
         type: String
    },
    level: {
         type: String
    },
    gender:{
        type: String
    },
    age:{
        type: Number
    },
    post: [{type: Schema.Types.ObjectId, ref: 'Post'}],

    facebook: {
        id: String,
        token: String,
        email: String,
        gender: String,
        age: Number
    },
    google: {
        id: String,
        token: String,
        email: String,
        gender: String,
        age: Number
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newUser.password, salt, function(err,hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};


module.exports.getUserByUid = function(uid, callback){
    var query = {uid:uid};
    User.findOne(query, callback);
};



module.exports.getUserById = function(id, callback){
    User.findById(id, callback);    // mongoose id 있나봄 기본으로
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err,isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
};