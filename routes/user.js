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
    userCart,getUserCart,cartRemove
}
    = require('../controller/userControl');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const cartModel = require('../models/cartModel');
    
const router = express.Router();



router.post('/register', createUser)
router.post('/forgot-password',forgotPasswordToken)
router.put('/reset-password/:token',resetPassword)
router.put('/password',authMiddleware,updatePassword)
router.post('/login', loginUser)

router.post('/cart', authMiddleware,userCart)
router.get('/cart', authMiddleware,getUserCart)
router.delete('/empty-cart',authMiddleware,cartRemove)

router.get('/refresh',handleRefreshToken)
router.get('/all-users', getallUser)

router.get('/:id', authMiddleware ,isAdmin,getaUser)
router.get('/:id',authMiddleware,)
router.delete('/:id', deleteaUser);

router.put('/:id',authMiddleware, updateaUser)




module.exports = router;