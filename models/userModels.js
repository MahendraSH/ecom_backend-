const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name!'],
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [30, 'Name must be at most 30 characters'],

    },
    email: {
        type: String,
        required: [true, 'Please enter your email!'],
        validator: [validator.isEmail, 'Please enter a valid email!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password!'],
        minLength: [6, 'Password must be at least 6 characters'],
        selct: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const SALT_KEY = Number(process.env.SALT_KEY) || 10;
    this.password = await bycrypt.hash(this.password, SALT_KEY);
    console.log(this.password);
    // console.log(SALT_KEY);
});

userSchema.methods.comparePassword = async function (password) {
    return await bycrypt.compare(password, this.password);
}

//  jwttoken generate 

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
};



userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};





module.exports = mongoose.model('User', userSchema);
