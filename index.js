
const app = require('./app');
const dbConnect = require('./config/DBconnect');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv').config({path:'./config/.env'});

const port = process.env.PORT||5000;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

dbConnect();
 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});