// require express
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();


const mongoDb = require('./config/mongoConfig');
mongoDb.mongoDB();



// require routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const Cart = require("./model/cartModel");

//set routes
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use( async (req, res) => {
    const userId = req.session.user;
    var cartProducts;
    if (userId) {
      cartProducts = await Cart.findOne({ user:userId });
    } else {
      cartProducts = undefined;
    }
    
    res.render(__dirname+'/views/users/error.ejs',{ cartProducts });
  });


// set the port
app.listen(process.env.PORT,() => console.log(`Server Started Successfully on port ${process.env.PORT}`))