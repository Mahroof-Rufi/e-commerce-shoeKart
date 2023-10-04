// require modules
const mongoose = require("mongoose");

// schema for Category
const categorySchema = mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
});

// export modules
module.exports = mongoose.model("Category",categorySchema);