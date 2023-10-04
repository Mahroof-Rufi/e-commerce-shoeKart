// require modules
const Admin = require('../model/adminModel');
const User = require('../model/usersModel');
const Category = require('../model/categoryModel');

const loadLogin = async (req,res) => {
    try {
        console.log("admin login section");
        res.render('login')
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
                res.render("dashboard");
            } else {
                res.render("login",{message : "invalid password"});
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// const block = async (req, res) => {
//     try {
//         const check = await User.findOne({ _id: req.query.id }); // Use req.query.id
//         console.log(req.query.id); // Log the ID to check
//         console.log(check);
//         check.status = false;
//         const userData = await check.save();
//         res.redirect('/admin/users');
//     } catch (error) {
//         console.log(error);
//     }
// }

// const unblock = async (req,res) => {
//     try {
//         const check = await User.findOne({ _id: req.query.id }); // Use req.query.id
//         console.log(req.query.id); // Log the ID to check
//         console.log(check);
//         check.status = true;
//         const userData = await check.save();
//         res.redirect('/admin/users');
//     } catch (error) {
//         console.log(error);
//     }
// }

const loadDashboard = async (req,res) => {
    try {
        res.render('dashboard');
    } catch (error) {
        console.log(error);
    }
}

const listProducts = async (req,res) => {
    try {
        res.render('products')
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadLogin,
    checkLogin,
    loadDashboard,
    listProducts,
}