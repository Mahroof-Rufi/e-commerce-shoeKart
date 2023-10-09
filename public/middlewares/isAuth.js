const isAuth = async (req,res,next) => {
    try {
        if(req.cookies.isLoggedIn){
            next()
        } else {
            res.redirect('/login_page');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    isAuth
}