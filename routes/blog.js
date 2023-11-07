const express=require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, getAllBlog, getaBlog ,updateaBlog, deleteaBlog ,likedBlog} = require('../controller/blogControl');
const router=express.Router();

router.post('/',authMiddleware,isAdmin,createBlog);
router.put('/likes',authMiddleware,likedBlog )

router.get('/all-blog',authMiddleware,isAdmin,getAllBlog)
router.get('/:id',authMiddleware,isAdmin,getaBlog)
router.put('/:id',authMiddleware,isAdmin,updateaBlog)
router.delete('/:id',authMiddleware,isAdmin,deleteaBlog)


module.exports=router;