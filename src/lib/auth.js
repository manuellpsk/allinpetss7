const ses={};

ses.isAuth=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }return res.redirect('/signin');
};

module.exports=ses;

/* module.exports={
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
        }
        return res.redirect('/signin');
    }
}; */
/* 

if(req.isAuthenticated()){

}else{
    res.redirect('/signin');
} 

*/