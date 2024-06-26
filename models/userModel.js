const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto=require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    lastname: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type:String,
        default:"User"

    },
    cart:{
        type:Array,
        default:[],
    },
    address:{
        type:String,
        
    },

    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],

    refreshToken:{
        type:String,
    },
    
    resetPasswordToken:{
       type: String,
    },
    resetPasswordExpire:{
        type:Date
    } 
},
    {
        timestamps: true
    }
);


userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createPasswordResetToken= async function(){
    const resetToken=crypto.randomBytes(32).toString("hex"); //random data and the number of bytes to be generated in the written code.
    this. resetPasswordToken=crypto  //ecryption
          .createHash('sha256')
          .update(resetToken)
          .digest('hex')
    this.resetPasswordExpire=Date.now()+30*60*1000; // valid for 10 mins

   return resetToken;
}
//Export the model
module.exports = mongoose.model('User', userSchema);