// require modules
const express = require("express");
const cookirParser = require('cookie-parser');
const user_route = express();

// set view engine
user_route.set('view engine','ejs');
user_route.set('views','./views/users');

// set middlewares
user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));
user_route.use(express.static('public'))
user_route.use(cookirParser());

// require user controller
const userController = require("../controller/userController");

// set routes
user_route.get('/',userController.checkUser);
user_route.get('/login_page',userController.loadLogin);
user_route.get('/login',userController.validateLogin);
user_route.get('/signup_page',userController.loadSignup);
user_route.post('/signup',userController.insertUser);
user_route.get('/home',userController.loadHome);
user_route.get('/confirm_otp',userController.confirmOtp);
// user_route.get('/block',userController.block);
// user_route.get('/unblock',userController.unblock);

// export modules
module.exports = user_route;