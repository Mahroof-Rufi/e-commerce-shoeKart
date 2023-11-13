// require modules
const mongoose = require("mongoose");

// schema for Category
const bannerSchema = mongoose.Schema({

    image:{
        type:String,
        require:true
    },
    subtile:{
        type:String,
        require:false
    },
    text:{
        type:String,
        require:false
    },
    priceText:{
        type:String,
        require:false
    },
    category:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    }
});

// export modules
module.exports = mongoose.model("Banner",bannerSchema);