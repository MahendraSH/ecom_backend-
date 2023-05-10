const CatchAsycErrors = require("../middlewares/catchAsyncError");
const userModels = require("../models/userModels");
const ErrorHandler = require("../utils/ErrorHandler");

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
    res.status(200).json({
        success: true,
        user
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

module.exports = { registor, getAllusers, getUserById, updateUser };
