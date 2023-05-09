const mongoose = require('mongoose');

const dbConnect = () => {
    console.log("db connection " + process.env.Mongodb_url);
    mongoose.connect(process.env.Mongodb_url,)
        .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
        }).catch((err) => {
            console.log(err);
        });
}

module.exports = dbConnect;
