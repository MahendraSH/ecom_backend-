const mongoose = require('mongoose');

const OrderShema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,

            required: [true, " please enter the address"],
        },
        city: {
            type: String,
            required: [true, " please enter the city"],
        },
        state: {
            type: String,
            required: [true, " please enter the state"],
        },
        contry: {
            type: String,
            required: [true, " please enter the contry"],
        },
        pincode: {
            type: Number,
            required: [true, "  please enter the pincode"],
        },
        phoneNO: {
            type: String,
            required: [true, " please enter the phone number "],
            minLength: [10, "phone number must be 10 characters"]
        },
    },
    orderItems: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        product: {
            type: mongoose.ObjectId,
            ref: "Product",
            required: true,
        },

    },],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    paymentInfo: {
        id: {
            type: String,
            require: [true, "please add the payment id "],
        },
        stauts: {
            type: String,

            require: [true, "please add the payment status "],
        },
    },
    paidAt: {
        type: Date,
        require: [true, "please add the payment date "],
    },

    itemPrice: {

        type: Number,
        required: true,
        default: 0,
    },


    taxPrice: {

        type: Number,
        required: true,
        default: 0,
    },


    shippingPrice: {

        type: Number,
        required: true,
        default: 0,
    },

    TotalPrice: {

        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "processing",
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    }

})

module.exports = mongoose.model("Order", OrderShema);