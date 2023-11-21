// require express
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();


// require and connect mongodb(Database)
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(() => console.log("MongoDB is Connected"))
.catch((err) => console.log(err));


// require routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const Cart = require('./model/cartModel');

//set routes
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use( async (req, res) => {
    const cartProducts = await Cart.findOne({ user:req.session.user });
    res.status(404).render(__dirname+'/views/users/error.ejs',{ cartProducts:cartProducts });
  });


// set the port
app.listen(process.env.PORT,() => console.log(`Server Started Successfully on port ${process.env.PORT}`))