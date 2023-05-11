const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
    },
    discrpition: {
        type: String,
        required: [true, 'Please enter product description'],
    },

    ratings: {
        type: Number,
        default: 0,
        required: true
    },
    images: [
        {

            public_id: {
                type: String,
                required: true
            },

            url: {
                type: String,
                required: true
            },

        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
    },

    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 1
    },

    numOfReviews: {
        type: Number,
        default: 0,
        required: true
    },
    reviews: [
        {

            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true

            },
            name: {
                type: String,
                required: true

            },
            rating: {
                type: Number,
                required: true

            },
            comment: {
                type: String,

            },
            createdAt: {
                type: Date,
                default: Date.now,
                required: true
            },
        },
    ],

    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }

});

module.exports = mongoose.model('Product', productSchema);



