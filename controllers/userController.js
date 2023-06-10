const CatchAsycErrors = require("../middlewares/catchAsyncError");
const userModels = require("../models/userModels");
const ErrorHandler = require("../utils/ErrorHandler");
const sendTokenCooki = require("../utils/sendTokenCooki");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");

// auth user conrollers 
//  registor users 
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

// login user 
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

//  logout user
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

// forgot password user 

const forgotPassword = CatchAsycErrors(async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        return (next(new ErrorHandler("please enter email", 400)));
    }
    const user = await userModels.findOne({ email });
    if (!user) {

        return (next(new ErrorHandler("user not found", 404)));
    }

    const resetPasswordToken = user.generateResetToken();


    await user.save({ validateBeforeSave: false });
    // create reset password url

    const restPasswordurl = `${req.protocol}://${req.get(
        "host"
    )}/api/user/reset/${resetPasswordToken}`;
    const message = `your password reset token is as follow:\n\n${restPasswordurl}\n\nif you have not requested this email then ignore it`;
    try {
        await sendEmail({
            email: user.email,
            subject: "smartEcom store password recovery",
            message
        });
        res.status(200).json({
            success: true,
            message: `email sent to  ${user.email} successfully`
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return (next(new ErrorHandler(err.message, 500)))

    }
});
// resetPassword user
const restPassword = CatchAsycErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash(process.env.crypto_algo)
        .update(req.params.link)
        .digest('hex');
    const user = await userModels.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    },)
    if (!user) {
        return next(new ErrorHandler("The reset password  link is invalid or expired ", 400))
    }


    const password = req.body.password;
    const conformPassword = req.body.conformPassword;
    if (!password || !conformPassword) {
        return next(new ErrorHandler(" The password : is required please enter it , The conformPassword : is required please enter it and both must be same", 400));
    }
    if (password !== conformPassword) {

        return next(new ErrorHandler("please enter the same passwords ", 400));

    }
    user.resetPasswordToken = undefined;
    user.password = password;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenCooki(user, 200, res);
    
});
//  user`s profile user controllers 
//  my profile details
const myProfile = CatchAsycErrors(async (req, res, next) => {

    const user = await userModels.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        user
    });
});

//  update by profile password 
const updateProfilePassword = CatchAsycErrors(async (req, res, next) => {
    const user = await userModels.findById(req.user.id).select("+password");
   if(!req.body.oldPassword|| !req.body.newPassword || !req.body.conformPassword){
       return (next(new ErrorHandler(" oldPassword,newPassword,conformPassword are required", 400)));
   }    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return (next(new ErrorHandler("old password is incorrect", 400)));
    }
    if (req.body.newPassword !== req.body.conformPassword) {
        return (next(new ErrorHandler("new password and conform password are not same", 400)));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenCooki(user, 200, res);
});

const updateProfile = CatchAsycErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        //  add cloudinary later for avtar image update 
    };
    const user = await userModels.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        user
    });
});
//  admin user controllers

// get all users
const getAllusers = CatchAsycErrors(async (req, res, next) => {
    const users = await userModels.find();
    res.status(200).json({
        success: true,
        users
    })
});



// get user by id
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
// update user role 
const updateUserRole = CatchAsycErrors(async (req, res, next) => {
   const user = await userModels.findById(req.params.id);
   
    if (!user) {

        return (next(new ErrorHandler("user not found", 404)));
    }
    if(!req.body.role){
        return (next(new ErrorHandler("please enter role", 400)));
    }
    user.role = req.body.role;
    await user.save();
    res.status(200).json({
        success: true,
        user
    })
});


// update user
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

// delete user
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



module.exports = {
    registor,
    getAllusers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    logout,
    forgotPassword,
    restPassword,
    myProfile,
    updateProfilePassword,
   updateProfile,
   updateUserRole,

};
