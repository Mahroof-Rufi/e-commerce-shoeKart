// require models
const Order = require('../model/orderModel');
const User = require('../model/usersModel');
const Cart = require('../model/cartModel');
const Product = require('../model/productsModel');
const Coupon = require('../model/couponModel');


// create an instance for payment
const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

//<================================== profile orders ==================================>

const renderOrderDetails = async (req,res) => {
    try {
        const fname = req.session.username
        const orders = await Order.find({_id:req.query._id});
        const orderProducts = await Order.find({user_Id:req.session.user});
        console.log("ordered products is :"+orderProducts);
        const cartProducts = await Cart.findOne({user:req.session.user});
        res.render('orderDetails',{orders,cartProducts,orderProducts,fname});
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req,res) => {
    try {
        const userId = req.session.user;
        const orderId = req.query.id;
        const orderDetails = await Order.findOne({_id:orderId});
        const products = orderDetails.products
        for (let i = 0; i < products.length; i++) {
                // const productToUpdate = await Products.findOne({_id:products[i].product_id});
                await Product.findOneAndUpdate(
    
                    { _id: products[i].product_id },
                    {
                        $inc: { stock: products[i].count } // Use $inc to increment the stock field
                    }
                );
            }

            const newTransactionHistory = {
                amount: orderDetails.totalAmount,
                direction: 'received',
                transactionDate: Date.now()
            }
            if (orderDetails.paymentMethod == 'Online payment') {
                await User.findOneAndUpdate(
                    { _id: userId },
                    {
                      $push: {
                        'wallet.transactionHistory': newTransactionHistory
                      },
                      $inc: { 'wallet.balance': orderDetails.totalAmount }
                    },
                    { upsert: true }
                );
            }              
        orderDetails.status = "cancelled";
        await orderDetails.save();
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}

const returnOrder = async (req,res) => {
    try {
        const orderId = req.body.orderId;
        const newData = await Order.findOneAndUpdate(
            { _id:orderId },
            { $set: { status:'return requested' } },
            { new:true },
        );
        console.log('here the updated data');
        console.log(newData);
        if (newData) {
            res.json({ success:true });
        } else {
            res.json({ success:false });
        }
    } catch (error) {
        console.log(error);
    }
}

//<================================== checkout ==================================>

const addOrder = async (req,res) => {
    try {
        // const orderedProducts = req.body.orderProducts
        const user_Id = req.session.user;
        const totalAmount = req.body.totalAmount;
        const discount = req.body.discount;
        const couponDetail = req.body.couponDetail ? JSON.parse(req.body.couponDetail) : null;
        const paymentMethod = req.body.paymentMethod;
        const shippingMethod = req.body.shippingMethod;
        const shippingCharge = req.body.shippingCharge;
        const addressIndex = req.body.selectedAddress;
        const userDetails = await User.findOne({ _id:user_Id });
        const actualAddress = userDetails.addresses[addressIndex];
        console.log('here the address and the payment method');
        console.log(actualAddress);
        console.log(paymentMethod);
        // console.log("actual address is:"+actualAddress);
        const products = await Cart.findOne({user:user_Id});
        // console.log("products from cart :"+products);
        const actualOrderProduct = products.products;
        // console.log("products only :"+actualOrderProduct);
        // console.log('here the datas :'+req.body.totalAmount+" "+req.body.paymentMethod);

        const newOrder = new Order({
            user_Id: user_Id,
            deliveryDetails: actualAddress,
            products: actualOrderProduct,
            purchaseDate: Date.now(),
            totalAmount: totalAmount,
            discount: discount,
            couponCode: couponDetail ? couponDetail.code : "",
            status: "placed",
            paymentMethod: paymentMethod,
            paymentStatus: 'pending',
            shippingMethod: shippingMethod,
            shippingFee: shippingCharge,
        })
        const saveDetail = await newOrder.save();

        if (couponDetail) {
            console.log('here the coupon details');
            console.log(couponDetail._id);
            await Coupon.findOneAndUpdate(
                { _id: couponDetail._id },
                {
                    $inc: { totalUsageLimit: -1 },
                    $push: { usedUsers: { userId: user_Id } }
                },
                { new: true, upsert: true }
            );
        }

        if (req.body.paymentMethod == 'Cash on delivery'){ 
            console.log("order saved succesfully");
            for( let i=0;i<products.products.length;i++){
                let product = products.products[i].product_id
                let count = products.products[i].count
            // console.log("product id and count is :"+product+" "+count);
                await Product.updateOne({_id:product},{$inc:{stock:-count}});
            }
            await Cart.deleteOne({ user: req.session.user });
            res.json({cod:true});
        } else if (req.body.paymentMethod == 'Wallet payment') {

            const newTransactionHistory = {
                amount: totalAmount,
                direction: 'paid',
                transactionDate: Date.now()
            }

            await User.findOneAndUpdate(
                { _id: user_Id },
                {
                  $push: {
                    'wallet.transactionHistory': newTransactionHistory
                  },
                  $inc: { 'wallet.balance': -totalAmount }
                },
                { upsert: true }
            );

            res.json({wallet:true});
        } else if (req.body.paymentMethod == 'Online payment') {
            console.log('this is the else if of payment method in checkout');
            const options = {
                amount: saveDetail.totalAmount*100,
                currency: 'INR',
                receipt: saveDetail._id + "",
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
        } else {
            res.json({success:false})
        }
    } catch (error) {
        console.log(error);
    }
}

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





const renderOrders = async (req,res) => {
    try {
      const orders = await Order.find().sort({ purchaseDate: -1 });
      res.render('orders',{orders});
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    renderOrderDetails,
    addOrder,
    verifyPayment,
    comfirmPayment,
    cancelOrder,
    returnOrder,
    renderOrders
}