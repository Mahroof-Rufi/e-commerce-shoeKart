// require modules
const mongoose = require("mongoose");

// schema for wishlist
const wishlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "products",
            },
        },
    ],
});

// export modules
module.exports = mongoose.model("Wishlist", wishlistSchema);
