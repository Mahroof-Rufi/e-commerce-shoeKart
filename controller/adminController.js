// require modules
const Admin = require('../model/adminModel');
const User = require('../model/usersModel');

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

module.exports = {
    Login,
    loadLogin,
    validateLogin,
    loadDashboard,
    logOut
}