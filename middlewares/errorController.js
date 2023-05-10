const e = require('express');
const ErrorHandler = require('../utils/ErrorHandler');

const errorController = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;

    err.message = err.message || "Internal Server Error";
    


    // Wrong Mongodb Id error

    if (err.name === "CastError") {

        const message = `Resource not found. Invalid: ${err.path}`;

        err = new ErrorHandler(message, 400);

    }

    // Mongoose duplicate key error
    // exmaple email may be duplicate

    if (err.code === 11000) {

        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;

        // console.log("email duplicate"); mogoose dulicape erorr 
        //  duplicate valuee enterd by user 
        err = new ErrorHandler(message, 400);

    }
    res.status(err.statusCode).json({

        success: false,
        message: err.message,
        error: err.stack,
    });
};



module.exports = errorController;



