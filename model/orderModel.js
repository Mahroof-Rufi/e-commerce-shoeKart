// require modules
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// schema for Orders
const orderSchema = mongoose.Schema({
    user_Id:{
        type:mongoose.Types.ObjectId
       },
       deliveryDetails: {
         type: Object,
         required: true,
       },
       products: [
         {
           product_id: {
             type: ObjectId,
             required: true,
           },
           name: {
             type: String,
             required: true,
           },
           category: {
             type: String,
             required: true,
           },
           image: {
             type:String,
             required: true,
           },
           count: {
             type: Number,
           },
           price: {
             type: Number,
             required: true,
           },
           totalPrice: {
             type: Number,
           }
         },
       ],
       
       purchaseDate: {
         type: Date,
         required: true
       },
       totalAmount: {
         type: Number,
         required: true,
       },
       status: {
         type: String,
         required: true
       },
       paymentMethod: {
         type: String,
         required: true
       },
       shippingMethod: {
         type: String,
         required: true
       },
       shippingFee: {
         type: String,
         required: true
       }
});

// export modules
module.exports = mongoose.model("Order", orderSchema);
