// require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require('method-override');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const session = require('express-session');
const user_route = express();


// set view engine
user_route.set('view engine','ejs');
user_route.set('views','./views/users');


// set middlewares
user_route.use(express.json());
user_route.use(morgan('dev'));
user_route.use(express.urlencoded({extended:true}));
user_route.use(express.static('public'))
user_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
}))
user_route.use(methodOverride('_method')); // middlewire for override HTTP method
user_route.use(mongoSanitizer());  // middleware for prevent noSql injection
user_route.use(xss());  // middleware for prevent site script xss


// require user controller
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");
const couponController = require("../controller/couponController");


// require the cart model
const Cart = require('../model/cartModel');


// require custom middlewares
const userAuth = require("../public/middlewares/UserAuth");


// set routes
//<================================== login ==================================>
user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.validateLogin);

//<================================== signup ==================================>
user_route.get('/signup',userController.loadSignup);
user_route.post('/signup',userController.insertUser);
user_route.post('/resend_otp',userController.sendOTP);
user_route.post('/confirm_otp',userController.confirmOtp);

//<================================== Home ==================================>
user_route.get('/',userController.loadHome);

//<================================== product details ==================================>
user_route.get('/product',userController.loadProduct);

//<================================== forgott password in login page ==================================>
user_route.get('/forgot_pass',userController.loadResetPass);
user_route.post('/forgot_pass',userController.validateEmail);
user_route.post('/reset_pass_otp',userController.confirmResetOtp);
user_route.post('/update_pass',userController.updatePass);

//<================================== cart ==================================>
user_route.get('/cart',userAuth.isAuth,cartController.loadCart);
user_route.post('/add_to_cart',userAuth.isAuth,cartController.addProduct);
user_route.post('/delete_from_cart',userAuth.isAuth,cartController.deleteProduct);
user_route.get('/edit_qnty',userAuth.isAuth,cartController.changeQuantity);
user_route.patch('/add_discount',userAuth.isAuth,couponController.addDiscount);

//<================================== wishlist ==================================>
user_route.get('/wishlist',userAuth.isAuth,userController.loadWishlist);
user_route.get('/add_to_wishlist',userAuth.isAuth,userController.addToWishlist);

//<================================== profile ==================================>
user_route.get('/profile',userAuth.isAuth,userController.loadProfile);
user_route.post('/edit_profile',userAuth.isAuth,userController.editProfile);
user_route.get('/change_pass',userAuth.isAuth,userController.loadChangePass);
user_route.post('/change_pass',userAuth.isAuth,userController.validateNewPass);
user_route.get('/change_mail',userAuth.isAuth,userController.loadNewMail);
user_route.post('/change_mail',userAuth.isAuth,userController.sendOTP);
user_route.post('/verify_mail_otp',userController.verifyNewMailOtp);

//<================================== profile address ==================================>
user_route.post('/add_address',userAuth.isAuth,userController.addNewAddress);
user_route.delete('/delete_address/:id',userAuth.isAuth,userController.deleteAddress);

//<================================== profile orders ==================================>
user_route.get('/orderDetails',userAuth.isAuth,orderController.renderOrderDetails);
user_route.get('/cancel_order',userAuth.isAuth,orderController.cancelOrder);
user_route.patch('/return_order',userAuth.isAuth,orderController.returnOrder);

//<================================== profile wallet ==================================>
user_route.post('/add_amount',userAuth.isAuth,userController.addMonetToWallet);

//<================================== checkout ==================================>
user_route.post('/checkout',userAuth.isAuth,userController.renderCheckout);
user_route.post('/place_order',userAuth.isAuth,orderController.addOrder);
user_route.post('/verify_payment',userAuth.isAuth,orderController.verifyPayment);
user_route.post('/comfirm-payment',userAuth.isAuth,orderController.comfirmPayment);
user_route.get('/order_sucess',userAuth.isAuth,userController.renderOrderSuccess);
user_route.post('/new_address',userAuth.isAuth,userController.addNewAddressFromCheckout);

//<================================== viewmore products ==================================>
user_route.get('/products',productController.listProducts);
user_route.post('/search',productController.searchProduct);
user_route.post('/filter_products',productController.filterProducts);
user_route.get('/clear_all',productController.listProducts);

//<================================== logout ==================================>
user_route.get('/logout',userController.logOut);

//<================================== undefined routes ==================================>
user_route.get("*", async (req,res) => {
    const cartProducts = await Cart.findOne({ user:req.session.user });
    res.render('error',{cartProducts});
});


// export modules
module.exports = user_route;