
const app = require('./app');
const dbConnect = require('./config/DBconnect');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv').config({ path: './config/.env' });

//  handling uncaught exception

process.on('uncaughtException', (err) => {
    err.statusCode = 500;
    err.message = err.message || "Internal Server Error";
    next(err);
    console.log(" uncaughtException error sever shutdowing ------......");

    process.exit(1);

});

const port = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

dbConnect();

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



//  un handle promise rejection

process.on('unhandledRejection', (err) => {
    err.statusCode = 500;
    err.message = err.message || "Internal Server Error";
    next(err);
    console.log(" unhandledRejection error sever shutdowing ------......");
    server.close(() => {
        process.exit(1);
    });
});