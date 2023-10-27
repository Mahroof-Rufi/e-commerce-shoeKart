// require and connect mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/e_commerce")
.then(() => console.log("MongoDB is Connected"))
.catch((err) => console.log(err));

// require express
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// for user routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use('/', userRoute);
app.use('/admin', adminRoute);



// set the port
app.listen(process.env.PORT,() => console.log(`Server Started Successfully on port ${process.env.PORT}`))