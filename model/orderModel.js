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
       deliveredDate: {
         type: Date,
       },
       returnedDate: {
         type: Date,
       },
       totalAmount: {
         type: Number,
         required: true,
       },
       discount: {
         type: Number,
         require: true,
       },
       usedCouponCode: {
         type: String,
       },
       status: {
         type: String,
         required: true
       },
       paymentMethod: {
         type: String,
         required: true
       },
       paymentStatus: {
         type: String,
         require: true
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
