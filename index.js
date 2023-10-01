// require and connect mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/e_commerce")
.then(() => console.log("MongoDB is Connected"))
.catch((err) => console.log(err));

// require express
const express = require("express");
const app = express();

// for user routes
const userRoute = require("./routes/userRoute");
app.use('/',userRoute);


// set the port
app.listen(3000,() => console.log("Server Started Successfully"))