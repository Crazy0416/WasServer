module.exports = function uidParamAuth(req, res, next){

    var uid = req.params.uid;

    if(req.session.uid === uid){
        next();
    }else{
        res.status(401).render('error', {
            message: "인증되지 않은 사용자입니다.",
            error:{
                status: 401,
                stack: "..."
            }
        });
    }

};