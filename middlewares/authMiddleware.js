const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");

const authMiddleware= asyncHandler(async(req,res,next)=>{
    if(req?.headers?.authorization?.startsWith('Bearer')){
       let token=req.headers.authorization.split(" ")[1];
       try{
         if(token){
            const decoded=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            //console.log(decoded);
            const user=await User.findById(decoded.id);
            req.user=user;
            next();
         }
       }catch(error){
         throw new Error("token expired,login again")
       }
    }else{
        throw new Error("there is no token");
    }
}) 

const isAdmin=asyncHandler(async(req,res,next)=>{
 
 const {email}=req.user;
 const adminUser=await User.findOne({email});
 if(adminUser.role !== "admin"){
   throw new Error("you are not admin")
 }else{
    next();
 }

})                             

module.exports={authMiddleware,isAdmin}