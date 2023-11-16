const express = require('express');
const payment_route = express();

payment_route.set('view engine','ejs');
payment_route.set('views','./views/admin');

payment_route.use(express.json());
payment_route.use(express.urlencoded({extended:false}));
payment_route.use(express.static('public'));

const paymentController = require("../controller/paymentController");

payment_route.get('/',paymentController.createOrder);
payment_route.post('/verify_payment',paymentController.verifyPayment);
payment_route.post('/comfirm-payment',paymentController.comfirmPayment);

module.exports = payment_route