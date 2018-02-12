var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connection = mongoose.createConnection("mongodb://localhost/loginapp", function(err) {
    if(err){
        console.log('mongodb connection Err' + err);
    } else {
        console.log('mongodb connection ok');
    }
});
//var upsert = require('mongoose-upsert');

var TagSchema = new Schema({
    tag_name: {type: String, required: true },

    count:{type: Number},

    createdAt: {type: Date, default: Date.now, required:true}
});

//TagSchema.plugin(upsert);
var Tag = module.exports = mongoose.model('Tag', TagSchema);


module.exports.createOrUpdateTagCount = function(newTag, callback){
    var query = {tag_name:newTag};
    Tag.update(query, {$inc: {count:1}, createdAt:new Date()}, {upsert:true}, callback);
    // Tag.update(query,{$inc:{count:1}},{upsert:true},callback);
    console.log('query : ', query);
};

module.exports.popListTag = function(callback){
    Tag.find({},{_id:0, createdAt:0,__v:0},{sort:{count:-1},limit:10},callback);
};

