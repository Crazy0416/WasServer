var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
    res.renderData = {};          // render 할 때 보낼 객체
    next();
});

/*
* GET /chatroom/:tag/:id?
* Render chatroom page
 */
router.get('/:tag', function(req, res, next){
    var tag = req.params.tag;
    res.renderData['title'] = "TagTalk";

    res.render('chatroom', res.renderData);
})

module.exports = router;