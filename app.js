const express = require('express');


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/product",require("./routers/productRoutes"));
app.use("/api/user",require("./routers/userRoutes"));

module .exports =app;