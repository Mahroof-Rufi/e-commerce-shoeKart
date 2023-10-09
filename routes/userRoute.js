// require modules
const express = require("express");
const session = require('express-session');
const user_route = express();

// set view engine
user_route.set('view engine','ejs');
user_route.set('views','./views/users');

// set middlewares
user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));
user_route.use(express.static('public'))
user_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false,
}))

// require user controller
const userController = require("../controller/userController");

// set routes
user_route.get('/',userController.loadHome);
user_route.get('/product',userController.loadProduct);
// user_route.get('/login_page',userController.loadLogin);
user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.validateLogin);
// user_route.get('/signup_page',userController.loadSignup);
user_route.get('/signup',userController.loadSignup);
user_route.post('/signup',userController.insertUser);
user_route.post('/resend_otp',userController.sendOTP);
user_route.post('/confirm_otp',userController.confirmOtp);
// user_route.get('/logout',userController.logOut);

// export modules
module.exports = user_route;