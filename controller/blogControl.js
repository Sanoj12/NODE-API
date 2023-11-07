const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const vaildateMongoDbId = require('../utils/vaildateMongodbID');
const asyncHandler = require('express-async-handler');


const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "Success",
            newBlog
        })

    } catch (error) {
        throw new Error(error);

    }

})
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getBlog = await Blog.find();
        res.json(getBlog)

    } catch (error) {
        throw new Error(error)
    }
})


const updateaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    vaildateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body,
            {
                new: true,
            }
        );
        res.json(updateBlog)

    } catch (error) {
        throw new Error(error);
    }
})


const getaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    vaildateMongoDbId(id);
    try {
        const getaBlog = await Blog.findById(id)
        .populate("likes")
        .populate("dislikes");
        const updateviews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            {
                new: true,
            }
        )
        res.json(getaBlog)
    } catch (error) {
        throw new Error(error);
    }
})

const deleteaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    vaildateMongoDbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json({
            status: "deleted successfully",
            deleteBlog
        })

    } catch (error) {
        throw new Error(error);
    }

})

const likedBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;

    vaildateMongoDbId(blogId);
    //console.log(req.body);
    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the logging user
    const loginuserId = req?.user?._id;

    //find if the user has liked the blog
    const isLiked = blog?.isLiked;

    //find if the user has disliked the blog

    const alreadyDisliked = blog?.dislikes?.find((
         (userId) => userId?.toString() === loginuserId?.toString()
    ));
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { dislikes: loginuserId },
                isDisLiked: false,

            }, {
            new: true
        }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { isLiked: loginuserId },
                isLiked: false,
            },
            {
                new: true,
            }
        )
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $push: { isLiked: loginuserId },
                isLiked: true,

            }, {
            new: true,
        })
        res.json(blog)
    }
})

const disLikedBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    vaildateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?._id;

    const isDisLiked = blog?.isDisLiked;

    const alreadyliked = blog?.likes?.find((
        (userId) => userId?.toString() === loginUserId?.toString()
    ));

    if (alreadyliked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        )
        res.json(blog);
    }

    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { dislikes:loginUserId},
                isDisLiked: false,
            },
            { new: true }
        )
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
              $push:{dislikes:loginUserId},
              isDisLiked:true,
            },
            {new:true}
        )
        res.json(blog)
        }

})

module.exports = { createBlog, getAllBlog, getaBlog, updateaBlog, deleteaBlog, likedBlog ,disLikedBlog}