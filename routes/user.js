const express = require('express');
const {
    createUser,
    loginUser,
    handleRefreshToken,
    getallUser,
    getaUser,
    deleteaUser,
    updateaUser, 
    updatePassword,forgotPasswordToken, resetPassword,
    userCart,getUserCart,cartRemove, saveAddress,createCoupon, ApplyCoupon
}
    = require('../controller/userControl');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const cartModel = require('../models/cartModel');
const userModel=require('../models/userModel')
    
const router = express.Router();



router.post('/register', createUser)
router.post('/forgot-password',forgotPasswordToken)
router.put('/reset-password/:token',resetPassword)
router.put('/password',authMiddleware,updatePassword)
router.post('/login', loginUser)

router.post('/cart', authMiddleware,userCart)
router.get('/cart', authMiddleware,getUserCart)
router.delete('/empty-cart',authMiddleware,cartRemove)

router.post('/createcoupon',authMiddleware,createCoupon)
router.post('/applyCoupon',authMiddleware,ApplyCoupon)

router.get('/refresh',handleRefreshToken)
router.get('/all-users', getallUser)

router.get('/:id', authMiddleware ,isAdmin,getaUser)
router.get('/:id',authMiddleware,)
router.delete('/:id', deleteaUser);

router.put('/:id',authMiddleware, updateaUser)
router.put('/save-address',authMiddleware, saveAddress)



module.exports = router;