const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({

    code: {
        type:String,
        require:true
    },
    description: {
        type:String,
        require:true
    },
    discountValue: {
        type:Number,
        require:true
    },
    activationDate: {
        type:Date,
        require:true
    },
    expireDate: {
        type:Date,
        require:true
    },
    minPurchaseAmount: {
        type:Number,
        require:true
    },
    totalUsageLimit: {
        type:Number,
        require:true
    },
    usedUsers: [
        {
            userId: {
                type: String,
            }
        }
    ]
})

module.exports = mongoose.model("Coupon", couponSchema);