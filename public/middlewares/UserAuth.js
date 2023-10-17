const isAuth = async (req,res,next) => {
    try {
        if(req.session.user){
                next()
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    isAuth
}