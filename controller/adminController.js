// require modules
const Admin = require('../model/adminModel');
const User = require('../model/usersModel');
const Order = require('../model/orderModel');
const Products = require('../model/productsModel');

const loadLogin = async (req,res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
    }
}

const Login = async (req,res) => {
    try {
        res.render('dashboard');
    } catch (error) {
        console.log(error);
    }
}

const validateLogin = async (req,res) => {
    try {
        // console.log("on admin logincheck section");
        const adminData = await Admin.findOne({email:req.body.email});

        if(!adminData){
            // console.log(req.query.email);
            // console.log(adminData);
            res.render("login",{message : "invalid mail"});
        } else {
            if(adminData.password === req.body.password){
                req.session.admin = adminData._id
                res.render("dashboard");
            } else {
                res.render("login",{message : "invalid password"});
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const loadDashboard = async (req,res) => {
    try {
        res.render('dashboard');
    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req,res) => {
    try {
        req.session.admin = null
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
}

const renderOrderDetails = async (req,res) => {
    try {
        const orders = await Order.find({_id:req.query.id});
        console.log("the query id is:"+req.query.id);
        console.log("order details is :"+orders);
        const orderProducts = await Order.find({user_Id:req.session.user});
        res.render('orderDetails',{orders,orderProducts});
    } catch (error) {
        console.log(error);
    }
}

const updateOrderStatus = async (req,res) => {
    try {
        const newStatus = req.body.data;
        console.log("on the status updation section");
        console.log("new status is :"+newStatus);
        const order = await Order.findOne({_id:req.body.id});
        console.log("the order data is :"+order);
        if (newStatus == 'cancelled') {
            console.log("on cancel if case");
            const products = order.products
            for (let i = 0; i < products.length; i++) {
                console.log("on loop of if case");
                // const productToUpdate = await Products.findOne({_id:products[i].product_id});
                await Products.findOneAndUpdate(
    
                    { _id: products[i].product_id },
                    {
                        $inc: { stock: products[i].count } // Use $inc to increment the stock field
                    }
                );
            }
        }
        order.status = newStatus;
        await order.save();
        res.json({result:true});  
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req,res) => {
    try {
        const order = await Order.findOne({_id:req.body.id});
        order.status = 'cancelled'
        await order.save();
        res.json({result:true});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    Login,
    loadLogin,
    validateLogin,
    loadDashboard,
    renderOrderDetails,
    updateOrderStatus,
    cancelOrder,
    logOut
}