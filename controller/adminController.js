// require modules
const Admin = require('../model/adminModel');
const User = require('../model/usersModel');

const loadLogin = async (req,res) => {
    try {
        if(req.cookies.isAdminLogged){
            res.redirect('/admin/dashboard')
        }else{
            res.render('login');
        }
    } catch (error) {
        console.log(error);
    }
}

const checkLogin = async (req,res) => {
    try {
        // console.log("on admin logincheck section");
        const adminData = await Admin.findOne({email:req.query.email});

        if(!adminData){
            // console.log(req.query.email);
            // console.log(adminData);
            res.render("login",{message : "invalid mail"});
        } else {
            if(adminData.password === req.query.password){
                res.cookie('isAdminLogged', true, { maxAge: 24 * 60 * 60 * 1000 });
                res.redirect('/admin/dashboard');
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
        res.clearCookie("isAdminLogged");
        res.redirect('/admin/');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadLogin,
    checkLogin,
    loadDashboard,
    logOut
}