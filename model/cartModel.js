// require modules
const mongoose = require("mongoose");

// schema for Category
const cartSchema = mongoose.Schema({

    user: {
        type:String,
        require:true,
        ref:"users",
    },
    products: [
        {
            product_id: {
                type:String,
                require:true,
                ref:"products",
            },
            name: {
                type:String,
                require:true
            },
            category: {
                type:String,
                require:true
            },
            count: {
                type:Number,
                require:true,
            },
            price: {
                type:Number,
                require:true,
            },
            image: {
                type:String,
                require:true
            }
        },
    ],
});

// export modules
module.exports = mongoose.model("Cart",cartSchema);