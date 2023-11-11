const Order = require('../model/orderModel');
const User = require('../model/usersModel');
const Cart = require('../model/cartModel');
const Product = require('../model/productsModel');
const Coupon = require('../model/couponModel');

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
        } else {
            res.redirect(`/payment?id=${saveDetail._id}&total=${saveDetail.totalAmount}`);
        }
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

const renderOrders = async (req,res) => {
    try {
      const orders = await Order.find().sort({ purchaseDate: -1 });
      res.render('orders',{orders});
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    addOrder,
    cancelOrder,
    returnOrder,
    renderOrders
}