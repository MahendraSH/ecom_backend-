const jwt = require("jsonwebtoken");
const CatchAsycErrors = require("./catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const userModels = require("../models/userModels");

const isAuthenticatedUser = CatchAsycErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        
        return(next(new ErrorHandler("Please login to access this route", 401)));
    }
   const decodeData =   jwt.verify(token, process.env.JWT_SECRET);
   const user = await userModels.findById(decodeData.id);
   if(!user){
       return(next(new ErrorHandler("Please login to access this route", 401)));
   }
   req.user = user;


    next();
});

//  autherizedRoles 

const autherizedRoles = (...roles) => {
    return (req, res, next) => {
        // console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return (next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this route`, 403)));
        }
        next();
    }
};
 

// const isAdmin = CatchAsycErrors(async (req, res, next) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json({
//             success: false,
//             message: "You are not allowed to access this route"
//         })
//     }
//     next();
// });

module.exports = { isAuthenticatedUser, autherizedRoles };