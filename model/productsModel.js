const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        image1:{
            type:String,
            required: true
        },
        image2:{
            type:String,
            required: true
        },
        image3:{
            type:String,
            required: true
        },
        image4:{
            type:String,
            required: true
        }
    }
})

module.exports = mongoose.model("products",productSchema);