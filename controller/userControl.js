const User = require('../models/userModel')
const Product = require("../models/productModel");
const Cart=require("../models/cartModel")
const asyncHandler = require('express-async-handler');


const { accessToken } = require('../config/jwtToken');
const vaildateMongoDbId = require('../utils/vaildateMongodbID');
const { accessRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailcontroller');
const crypto = require('crypto');
const productModel = require('../models/productModel');

//create User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;

    const useralready = await User.findOne({ email: email });
    if (!useralready) {
        //create new user
        const newUser = await User.create(req.body);
        res.json(newUser);

    } else {
        //user already exist
        throw new Error("user already exists");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists

    const userAlready = await User.findOne({ email });
    //cookie  

    if (userAlready && await userAlready.isPasswordMatched(password)) {
        //cookie
        const refreshToken = await accessRefreshToken(userAlready._id);

        const updateuser = await User.findByIdAndUpdate(userAlready._id,
            {
                refreshToken: refreshToken
            },
            {
                new: true,
            }
        );
        res.cookie('refreshToken', refreshToken, {

            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,

        })
        res.json({
            id: userAlready?._id,
            firstname: userAlready?.firstname,
            lastname: userAlready?.lastname,
            email: userAlready?.email,
            token: accessToken(userAlready?._id),

        })

    } else {
        throw new Error("Invalid user");

    }

})
//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie.refreshToken) throw new Error("No Refresh Token ");
    const refreshToken = cookie.refreshToken;

    console.log(refreshToken);

    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error("no token in cookies");

    jwt.sign(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err || user.id !== decoded) {
            throw new Error("somethin wrong")
        }
        const generateToken = accessToken(user._id);
        res.json({ generateToken })
    })
    res.json({ user })
})



//get all users

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    }
    catch (error) {
        throw new Error(error)
    }
})

//get a single user with id

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    vaildateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json(getaUser)
    }
    catch (error) {
        throw new Error(error);
    }
})

//delete a user

const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    vaildateMongoDbId(id);  //mongodb id vaildation process
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

//Update A user

const updateaUser = asyncHandler(async (req, res) => {
    console.log(req.user);
    const { id } = req.params;
    vaildateMongoDbId(id);

    try {
        const updateaUser = await User.findByIdAndUpdate(id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,

        }, {
            new: true,
        })
        res.json(updateaUser)
    }
    catch (error) {
        throw new Error(error);
    }
})


const updatePassword = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { _id } = req.user;
    const { password } = req.body;
    vaildateMongoDbId(_id);

    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save()
        res.json(updatePassword);
    } else {
        res.json(user);
    }

})

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('user not found')
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `hi please follow this link to reset your pasword. this link is valid till 10 min from now.<a href='http://localhost:4000/user/reset-password/${token}'>click</a>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot password",
            html: resetURL,
        };
        sendEmail(data);
        console.log(data);
        res.json(token);

    } catch (error) {
        throw new Error(error)
    }

})


const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user)
        throw new Error("Token Expired!,please try again");

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.json(user);

})
const getWishList=asyncHandler(async(req,res)=>{
    try {
        const { _id }=req.user;
        const findUser=await User.findById(id);
        res.json(findUser)
        
    } catch (error) {
        throw new Error(error)
    }
})


const userCart=asyncHandler(async(req,res)=>{
    const {cart} =req.body;
        const { _id }=req.user;
        vaildateMongoDbId(_id);
    try{
        let products=[]
        const user=await User.findById(_id);
        //if check cart is already exist

        const alreadyExistCart=await Cart.findOne({ orderby:user._id});
        if(alreadyExistCart){
            alreadyExistCart.remove()
        }
       for(let i=0; i<cart.length;i++){
         let obj={}
         obj.product=cart[i]._id;
         obj.count=cart[i].count;
         obj.color=cart[i].color;
         let getPrice=await Product.findById(cart[i]._id).select("price").exec();
         obj.price=getPrice.price;
         products.push(obj);
       }
       
        
       let cartTotal=0;
       for(let i=0;i< products.length;i++){
        cartTotal=cartTotal + products[i].price * products[i].count;

       }
       console.log(products,cartTotal);

       let newCart=await new Cart({
           products,
           cartTotal,
           orderBy:user?._id,
       }).save();
      res.json(newCart)
    }catch(err){
        throw new Error(err)
    }

})

const getUserCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    vaildateMongoDbId(_id);
    try{
      const cart=await Cart.findOne({orderBy:_id }).populate("products.product");
       res.json(cart)
    }catch(err){
        throw new Error(err);
    }
})
const cartRemove=asyncHandler(async(req,res)=>{
    const {_id}=req.body;
    vaildateMongoDbId(_id);
    try {
       const user=await User.findById({_id})
       const cart=await Cart.findByIdAndRemove({orderBy:user._id})
        res.json(cart)
    } catch (error) {
        throw new Error(error)

    }
})


module.exports = {
    createUser,
    loginUser,
    handleRefreshToken,
    getallUser,
    getaUser,
    deleteaUser,
    updateaUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getWishList,
    userCart,
    getUserCart,
    cartRemove
}
