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

//<================================== profile orders(users) =================================>

const renderOrderDetails = async (req,res) => {
    try {
        const userId = req.session.user;
        const fname = req.session.username
        const orders = await Order.find({_id:req.query._id});
        const orderProducts = await Order.find({user_Id:req.session.user});
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        res.render('orderDetails',{orders,cartProducts,orderProducts,fname});
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
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
        res.render('error',{ errorMessage:error.message });
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
        if (newData) {
            res.json({ success:true });
        } else {
            res.json({ success:false });
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== checkout(users) =======================================>

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
            for( let i=0;i<products.products.length;i++){
                let product = products.products[i].product_id
                let count = products.products[i].count
            // console.log("product id and count is :"+product+" "+count);
                await Product.updateOne({_id:product},{$inc:{stock:-count}});
            }
            await Cart.deleteOne({ user: req.session.user });
            res.json({cod:true});
        } else if (req.body.paymentMethod == 'Wallet payment') {
            for( let i=0;i<products.products.length;i++){
                let product = products.products[i].product_id
                let count = products.products[i].count
            // console.log("product id and count is :"+product+" "+count);
                await Product.updateOne({_id:product},{$inc:{stock:-count}});
            }
            await Cart.deleteOne({ user: req.session.user });

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
            const options = {
                amount: saveDetail.totalAmount*100,
                currency: 'INR',
                receipt: saveDetail._id + "",
            };
            razorpayInstance.orders.create(options, (err, order) => {
                if (err) {
                    throw new Error('something went wrong, try again later');
                } else {
                    res.json({ order });
                }
            });
        } else {
            res.json({success:false})
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const verifyPayment = async (req,res) => {
    try {
        const datas = req.body;
        const secretKey = process.env.RAZORPAY_SECRET_ID;
        const crypto  = require('crypto');
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(datas.res.razorpay_order_id+'|'+datas.res.razorpay_payment_id);
        const hmacValue = hmac.digest("hex");
        // console.log('the signature is :'+datas.res.razorpay_signature);
        // console.log('the pay id is :'+datas.res.razorpay_payment_id);
        // console.log('the hmac value is :'+hmacValue);

        if (hmacValue == datas.res.razorpay_signature) {
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
            res.json({success:false});
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
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
            const addedHistory = req.body.data;
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
            res.json({final:false});
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const deleteFailedOrder = async (req,res) => {
    try {
        console.log('this is the failed order deletion function');
        const orderId = req.body.orderId;
        console.log(orderId);
        const result = await Order.deleteOne({ _id:orderId });
        console.log(result);
        if (result.deletedCount > 0) {
            console.log('this is the deletion function success case');
            res.json({ success:true });
        } else {
            console.log('this is the deletion function failed case');
            res.json({ success:false });
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const renderOrderSuccess = async (req,res) => {
    try {
        const userId = req.session.user;
        const username = req.session.username;
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        res.render('orderSuccess',{ cartProducts,username });
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== orders(admin) =========================================>

const renderOrders = async (req,res) => {
    try {
      const orders = await Order.find().sort({ purchaseDate: -1 });
      res.render('orders',{orders});
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
  }

const OrderDetails = async (req,res) => {
    try {
        const orders = await Order.find({_id:req.query.id});
        const orderProducts = await Order.find({user_Id:req.session.user});
        res.render('orderDetails',{orders,orderProducts});
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const updateOrderStatus = async (req,res) => {
    try {
        const newStatus = req.body.data;
        const orderId = req.body.id;
        const order = await Order.findOne({_id:orderId});
        if (newStatus == 'cancelled') {
            const products = order.products
            for (let i = 0; i < products.length; i++) {
                await Product.findOneAndUpdate(
    
                    { _id: products[i].product_id },
                    {
                        $inc: { stock: products[i].count } 
                    }
                );
                await Order.findOneAndUpdate(
                  { _id:orderId },
                  { $set: { status: newStatus, paymentStatus: 'cancelled' } },
                );
            }
            const userId = req.session.user;
            const newTransactionHistory = {
              amount: order.totalAmount,
              direction: 'received',
              transactionDate: Date.now()
            }
  
            await User.findOneAndUpdate(
              { _id: userId },
              {
                $inc: { 'wallet.balance': order.totalAmount },
                $push: { 'wallet.transactionHistory': newTransactionHistory },
              },
            );
        } else if (newStatus == 'delivered') {
          await Order.findOneAndUpdate(
            { _id: orderId },
            { $set: { status: newStatus, paymentStatus: 'paid', deliveredDate: Date.now() } },
            { upsert: true },
          );
        } else if(newStatus == 'returned'){

            const products = order.products
            for (let i = 0; i < products.length; i++) {
                await Product.findOneAndUpdate(
    
                    { _id: products[i].product_id },
                    {
                        $inc: { stock: products[i].count } 
                    }
                );
                await Order.findOneAndUpdate(
                  { _id:orderId },
                  { $set: { status: newStatus, paymentStatus: 'cancelled' } },
                );
            }
          
          const userId = req.session.user;
          const newTransactionHistory = {
            amount: order.totalAmount,
            direction: 'received',
            transactionDate: Date.now()
          }

          await User.findOneAndUpdate(
            { _id: userId },
            {
              $inc: { 'wallet.balance': order.totalAmount },
              $push: { 'wallet.transactionHistory': newTransactionHistory },
            }
          );
          
        } else {
          await Order.findOneAndUpdate(
            { _id:orderId },
            { $set: { status: newStatus} },
          );
        }
        res.json({result:true});  
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const cancelOrderAdmin = async (req,res) => {
    try {
        const order = await Order.findOne({_id:req.body.id});
        order.status = 'cancelled'
        await order.save();
        res.json({result:true});
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

module.exports = {
    renderOrderDetails,
    OrderDetails,
    addOrder,
    updateOrderStatus,
    verifyPayment,
    comfirmPayment,
    deleteFailedOrder,
    cancelOrder,
    cancelOrderAdmin,
    returnOrder,
    renderOrderSuccess,
    renderOrders
}