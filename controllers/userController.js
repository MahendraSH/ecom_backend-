const CatchAsycErrors = require("../middlewares/catchAsyncError");
const userModels = require("../models/userModels");
const ErrorHandler = require("../utils/ErrorHandler");
const sendTokenCooki = require("../utils/sendTokenCooki");

const registor = CatchAsycErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await userModels.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicurl"
        },
 
    });
    sendTokenCooki(user, 201, res);
});

const login = CatchAsycErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return (next(new ErrorHandler("please enter email and password", 400)));
    }
    const user = await userModels.findOne({ email }).select("+password");
    if (!user) {
        return (next(new ErrorHandler("invalid email or password", 401)));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return (next(new ErrorHandler("invalid email or password", 401)));
    }
   sendTokenCooki(user, 200, res);  
});


const logout = CatchAsycErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "logged out"
    })
});


const getAllusers = CatchAsycErrors(async (req, res, next) => {
    const users = await userModels.find();
    res.status(200).json({
        success: true,
        users
    })
});


const getUserById = CatchAsycErrors(async (req, res, next) => {

    const user = await userModels.findById(req.params.id);
    if (!user) {

        return (next(new ErrorHandler("user not found", 404)));
    }
    res.status(200).json({
        success: true,
        user
    })
});

const updateUser = CatchAsycErrors(async (req, res, next) => {
    const user = await userModels.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    if (!user) {

        return (next(new ErrorHandler("user not found", 404)));
    }
    res.status(200).json({
        success: true,
        user
    })
});
const deleteUser = CatchAsycErrors(async (req, res, next) => {
    const user = await userModels.findByIdAndDelete(req.params.id);
    if (!user) {

        return (next(new ErrorHandler("user not found", 404)));
    }
    res.status(200).json({
        success: true,
        message: "user deleted successfully"
    })
});

module.exports = { registor, getAllusers, getUserById, updateUser,login,logout };
