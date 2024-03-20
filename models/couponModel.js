const mongoose = require("mongoose");

var couponSchema=new mongoose.Schema({
     name:{
        type:String,
        required:true,
     },
     expiry:{
        type:Date,
        required:true,
        default:Date.now(),
     },
     discount:{
        type:Number,
        required:true,
     }
})


module.exports = mongoose.model('Coupon', couponSchema);