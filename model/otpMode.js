// require modules
const mongoose = require("mongoose");

// create otp schema
const otpSchema = mongoose.Schema({

    email:{
        type:String,
        require:true
    },
    otp:{
        type:Number,
        require:true
    }

});

// export modules
module.exports = mongoose.model("OTP",otpSchema);