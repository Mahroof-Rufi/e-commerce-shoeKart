// require modules
const mongoose = require("mongoose");

// create admin schema
const adminSchema = mongoose.Schema({

    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }

});

// export modules
module.exports = mongoose.model("Admin",adminSchema)