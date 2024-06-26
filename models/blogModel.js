const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
        unique:true,
    },
    numViews:{
        type:Number,
        required:true,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisLiked:{
        type:Boolean,
        default:false,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],

    image:{
        type:String,
        default:
     "https://www.shutterstock.com/shutterstock/photos/1029506242/display_1500/stock-photo-blogging-blog-concepts-ideas-with-white-worktable-1029506242.jpg"
    },
    author:{
        type:String,
        default:"Admin",

    }
},{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    
        timestamps:true
    
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);