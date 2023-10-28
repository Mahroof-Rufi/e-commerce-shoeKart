const Order = require('../model/orderModel');
const Cart = require('../model/cartModel');
const Address = require('../model/addressModel');
const Product = require('../model/productsModel');

const addOrder = async (req,res) => {
    try {
        // const orderedProducts = req.body.orderProducts
        const user_Id = req.session.user;
        const addressIndex = req.body.selectedAddress;
        const userAddress = await Address.findOne({userId:user_Id});
        const actualAddress = userAddress.address[addressIndex];
        // console.log("actual address is:"+actualAddress);
        const products = await Cart.findOne({user:user_Id});
        console.log("products from cart :"+products);
        const actualOrderProduct = products.products;
        console.log("products only :"+actualOrderProduct);
       
        const newOrder = new Order({
            user_Id: user_Id,
            deliveryDetails: actualAddress,
            products: actualOrderProduct,
            purchaseDate: Date.now(),
            totalAmount: req.body.totalAmount,
            status: "placed",
            paymentMethod: req.body.paymentMethodField,
            shippingMethod: req.body.shippingMethod,
            shippingFee: req.body.shippingCharge,
        })


        console.log("the full data is :"+newOrder);
         for( let i=0;i<products.products.length;i++){
          let product = products.products[i].product_id
          let count = products.products[i].count
          console.log("product id and count is :"+product+" "+count);
          await Product.updateOne({_id:product},{$inc:{stock:-count}});
        }
        await newOrder.save();
        console.log("order saved succesfully");
        await Cart.deleteOne({ user: req.session.user });
        res.render("orderSuccess");

    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req,res) => {
    try {
        const orderDetails = await Order.findOne({_id:req.query.id});
        console.log("the complete order details is"+orderDetails);
            const products = orderDetails.products
            console.log("the products only is :"+products);
            console.log("product id and count is :"+products[0].product_id+" "+products[0].count);
            for (let i = 0; i < products.length; i++) {
                // const productToUpdate = await Products.findOne({_id:products[i].product_id});
                await Product.findOneAndUpdate(
    
                    { _id: products[i].product_id },
                    {
                        $inc: { stock: products[i].count } // Use $inc to increment the stock field
                    }
                );
            }
        orderDetails.status = "cancelled";
        await orderDetails.save();
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}

const renderOrders = async (req,res) => {
    try {
      const orders = await Order.find();
      res.render('orders',{orders});
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    addOrder,
    cancelOrder,
    renderOrders
}