const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name!'],
        minLength: [3, 'Name must be at least 3 characters'],

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

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const SALT_KEY= process.env.SALT_KEY|| 10;
    this.password = await bycrypt.hash(this.password, SALT_KEY );
    console.log(this.password);
    console.log(SALT_KEY);
});

userSchema.methods.comparePassword = async function (password) {
    return await bycrypt.compare(password, this.password);
}




module.exports = mongoose.model('User', userSchema);
