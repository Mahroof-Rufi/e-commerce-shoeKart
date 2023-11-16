const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true
    },
    expiration: {
        type: Date,
        required: true,
    },
});

otpSchema.index({ expiration: 1 }, { expireAfterSeconds: 100 });

module.exports = mongoose.model("OTP",otpSchema);