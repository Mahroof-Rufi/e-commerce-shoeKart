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
    saveUninitialized:true,
}))

// require user controller
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");
const addressController = require("../controller/addressController");
const orderController = require("../controller/orderController");

// require user authentication
const userAuth = require("../public/middlewares/UserAuth");

// set routes
user_route.get('/',userController.loadHome);
user_route.get('/product',userController.loadProduct);
user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.validateLogin);
user_route.get('/forgot_pass',userController.loadResetPass);
user_route.post('/forgot_pass',userController.validateEmail);
user_route.post('/reset_pass_otp',userController.confirmResetOtp);
user_route.post('/update_pass',userController.updatePass);
user_route.get('/signup',userController.loadSignup);
user_route.post('/signup',userController.insertUser);
user_route.post('/resend_otp',userController.sendOTP);
user_route.post('/confirm_otp',userController.confirmOtp);
user_route.get('/products',productController.listProducts);
// user_route.get('/next_page');
user_route.post('/filter_products',productController.filterProducts);
user_route.get('/clear_all',productController.listProducts);
user_route.post('/add_to_cart',userAuth.isAuth,cartController.addProduct);
user_route.post('/delete_from_cart',userAuth.isAuth,cartController.deleteProduct);
user_route.get('/cart',userAuth.isAuth,cartController.loadCart);
user_route.get('/edit_qnty',userAuth.isAuth,cartController.changeQuantity);
user_route.get('/profile',userAuth.isAuth,userController.loadProfile);
user_route.post('/edit_profile',userAuth.isAuth,userController.editProfile);
user_route.get('/change_pass',userAuth.isAuth,userController.loadChangePass);
user_route.post('/change_pass',userAuth.isAuth,userController.validateNewPass);
user_route.get('/change_mail',userAuth.isAuth,userController.loadNewMail);
user_route.post('/change_mail',userAuth.isAuth,userController.sendOTP);
user_route.post('/verify_mail_otp',userController.verifyNewMailOtp);
user_route.post('/add_address',userAuth.isAuth,addressController.validateNewAddress);
user_route.delete('/delete_address/:id',userAuth.isAuth,addressController.deleteAddress);
user_route.post('/checkout',userAuth.isAuth,userController.renderCheckout);
user_route.post('/place_order',userAuth.isAuth,orderController.addOrder);
user_route.get('/orderDetails',userAuth.isAuth,userController.renderOrderDetails);
user_route.get('/cancel_order',userAuth.isAuth,orderController.cancelOrder);
user_route.get('/logout',userController.logOut);

// export modules
module.exports = user_route;