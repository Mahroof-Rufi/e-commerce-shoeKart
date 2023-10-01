// require modules
const mongoose = require("mongoose");

// schema for send userData to DataBase
const userSchema = mongoose.Schema({

    fname:{
        type:String,
        require:true
    },
    lname:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean,
        require:true
    }
});

// export modules
module.exports = mongoose.model("User",userSchema);