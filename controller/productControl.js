const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
const User = require('../models/userModel')
const Coupon =require("../models/couponModel")
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        replacement: '_',
      })
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct)
  }
  catch (err) {
    throw new Error(err);
  }
})
//get a product
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    //filtering

    const findProduct = await Product.findById(id);
    res.json(findProduct)

  } catch (error) {
    throw new Error(error)

  }
})

//get all product

const getAllProducts = asyncHandler(async (req, res) => {
  //console.log(req.query);
  //const
  try {
    //FILTERING 
    const queryObj = { ...req.query };
     const excludeFields = ['page', 'sort', 'limit', 'fields']
     excludeFields.forEach(elements => delete queryObj[elements]);
     console.log("queryObj:", queryObj);
   const regex = /\b(gt|gte|lt|lte|in)\b/g;
    let querystr=JSON.stringify(queryObj);
    querystr = querystr.replace(regex, (match) => `$${match}`)
    console.log(JSON.parse(querystr));
    
   let query=Product.find(JSON.parse(querystr));


   //SORTING METHOD

   if(req.query.sort){
   
     const sortBy=req.query.sort.split(",").join(" ");
     query=query.sort(sortBy);
    
   }else{
      query=query.sort("-createdAt");
   }


   //LIMITED METHOD

   if(req.query.fields){
    let fields=req.query.fields.split(",").join(" ");
    query=query.select(fields);

   }else{
    query=query.select('__v');
   }

   //PAGINATION METHOD

   const page=req.query.page;
   const limit=req.query.limit;
   const skip=(page - 1) * limit;
   query=query.skip(skip).limit(limit)
    console.log(page,limit,skip);


    const Products = await query;
    res.json(Products)

  } catch (error) {
    throw new Error(error);
  }
})


//update a products


const updateaProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {

    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updateProducts = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    console.log(updateProducts);
    res.json(updateProducts)
  } catch (error) {
    throw new Error(error)
  }
})

//delete a product

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteproduct = await Product.findByIdAndDelete(id);
    res.json(deleteproduct);

  } catch (error) {
    throw new Error(error);

  }
})


const addToWishlist=asyncHandler(async(req,res)=>{
  const {_id}= req.user;
  const { ProdId }=req.body;
  try {
    
     const user=await User.findById(_id);
     const allreadyadded=user.wishlist.find((id)=>id.toString()===ProdId);
     if(allreadyadded){
        let user=await User.findByIdAndUpdate(_id,
          {
          $pull: {wishlist: ProdId},
        },
        {
          new:true,
        }
        );
        res.json(user);
       
     }else{
         let user=await User.findByIdAndUpdate( _id,{
           $push: { wishlist: ProdId},
         },
         {
          new:true,
         }
         );
        res.json(user);
       
     }
  } catch (error) {
    throw new error(error)
  } 
})
const createCoupon=asyncHandler(async(req,res)=>{
  const {_id}=req.user;
    try {
      const newCoupon=await Coupon.create(req.body);
      res.json(newCoupon);
      console.log(newCoupon);
    } catch (error) {
       throw new Error(error)
    }
})


module.exports = { createProduct, getaProduct, getAllProducts, updateaProducts, deleteProduct ,addToWishlist,createCoupon};