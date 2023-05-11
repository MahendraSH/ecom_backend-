const cookieParser = require('cookie-parser');
const express = require('express');


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  

app.use("/api/product",require("./routers/productRoutes"));
app.use("/api/user",require("./routers/userRoutes"));

// use error controller

app.use(require("./middlewares/errorController"));

module .exports =app;