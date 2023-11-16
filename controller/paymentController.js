const Razorpay = require('razorpay');
const Cart = require('../model/cartModel');
const Order = require('../model/orderModel');
const User = require('../model/usersModel');
const Product = require('../model/productsModel');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

const createOrder = async (req, res) => {
    try {
        console.log("on payment controller");
        const amount = req.query.total*100;
        const id = req.query.id;
        console.log("id and total is:" + amount + " " + id);
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: id + "",
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.log("Error creating order:", err);
                res.status(400).send({ success: false, msg: 'Something went wrong!' });
            } else {
                console.log("Order created successfully:", order);
                res.json({ order });
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

const verifyPayment = async (req,res) => {
    try {
        console.log('on payment verify section');
        const datas = req.body;
        console.log(datas);
        console.log(datas.res.razorpay_payment_id);
        const secretKey = process.env.RAZORPAY_SECRET_ID;
        const crypto  = require('crypto');
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(datas.res.razorpay_order_id+'|'+datas.res.razorpay_payment_id);
        const hmacValue = hmac.digest("hex");
        // console.log('the signature is :'+datas.res.razorpay_signature);
        // console.log('the pay id is :'+datas.res.razorpay_payment_id);
        // console.log('the hmac value is :'+hmacValue);

        if (hmacValue == datas.res.razorpay_signature) {
            console.log('on the if case');
            const cartData = await Cart.findOne({user:req.session.user});
            for( let i = 0; i < cartData.products.length; i++){
                let productId = cartData.products[i].product_id
                let count = cartData.products[i].count
                // console.log('product id and count is:'+productId+" "+count);
                await Product.updateOne({ _id: productId }, { $inc: { stock: -count } });
            }
            cartData.products = [];
            await cartData.save();

            await Order.findByIdAndUpdate(
                { _id: datas.order.receipt },
                { $set: { paymentStatus: "paid" } }
            );
            res.json({success:true});
        } else {
            console.log('on the else case');
            res.json({success:false});
        }
    } catch (error) {
        console.log(error);
    }
}

const comfirmPayment = async (req,res) => {
    try {
        const userId = req.session.user;
        const order = req.body.order;
        const payment = req.body.payment;
        const secretKey = process.env.RAZORPAY_SECRET_ID;
        const crypto  = require('crypto');
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(payment.razorpay_order_id+'|'+payment.razorpay_payment_id);
        const hmacValue = hmac.digest("hex");

        if (hmacValue == payment.razorpay_signature) {
            console.log('on the if case');
            const addedHistory = req.body.data;
            console.log('here the addedHistory0');
            console.log(addedHistory);
            const result = await User.updateOne(
                { 
                    _id: userId,
                    'wallet.transactionHistory._id': addedHistory._id 
                },
                { 
                    $inc: { 'wallet.balance' : addedHistory.amount },
                    $unset: { 'wallet.transactionHistory.$.confirm': 1 }
                },
                { new: true }
            );

            if (result.modifiedCount > 0) {
                res.json({final:true});
            } else {
                res.json({final:false});
            }
        } else {
            console.log('on the else case');
            res.json({final:false});
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createOrder,
    verifyPayment,
    comfirmPayment
};
