// require modules
const mongoose = require("mongoose");

// schema for Address
const addressSchema = mongoose.Schema({

    userId: {
        type:String,
        require:true,
        ref:"users",
    },
    address:[
        {
            fullName:{
                type:String,
                required:true,
                trim:true
            },
            mobile:{
                type:Number,
                required:true,
                trim:true
            },
            houseName:{
                type:String,
                required:true,
                trim:true
            },
            colony:{
                type:String,
                required:true,
                trim:true
            },
            city:{
                type:String,
                required:true,
                trim:true
            },
            state:{
                type:String,
                required:true,
                trim:true
            },
            pin:{
                type:String,
                required:true,
                trim:true
            },
        }
    ],
});

// export modules
module.exports = mongoose.model("Address",addressSchema);