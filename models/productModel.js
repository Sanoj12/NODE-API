const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required:true,
    },
    brand: {
        type: String,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
     //    select:false,  hide fields
    },
    sold: {
        type: Number,
        default: 0,
     
    },
    image: {
        type: Array,
    }
},
    {
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);