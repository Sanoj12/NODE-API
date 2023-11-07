const express=require('express');
const { createProduct, getaProduct ,getAllProducts, updateaProducts, deleteProduct, addToWishlist} = require('../controller/productControl');
const {isAdmin,authMiddleware}=require('../middlewares/authMiddleware')
const router=express.Router()


router.post('/',authMiddleware,isAdmin,createProduct)
router.get('/:id',authMiddleware,getaProduct);

router.put('/wishlist',authMiddleware,addToWishlist);


router.put ('/:id',authMiddleware,isAdmin,updateaProducts);
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);
router.get('/',getAllProducts);

module.exports=router