// require modules
const User = require("../model/usersModel");
const Products = require("../model/productsModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

// load login page
const loadLogin = async (req,res) => {

    try {
        res.render("logIn")
    } catch (error) {
        console.log(error);
    }
};

// load signup page
const loadSignup = async (req,res) => {
    try {
        res.render("signUp")
    } catch (error) {
        console.log(error);
    }
}

// load homepage
const loadHome = async (req,res) => {
    try {
        if(req.cookies.isLoggedIn){
            const products = await Products.find();
            res.render("home",{products});
        }else{
            res.redirect('/login_page');
        }
    } catch (error) {
        console.log(error);
    }
}

let generatedOtp

// insert user data to database
const insertUser = async(req,res) => {

    try {
        const hashedPass = await bcrypt.hash(req.body.password, 13);
        const user = new User({
            fname:req.body.fname,
            lname:req.body.lname,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            password:hashedPass,
            isVerified:false,
            status:true
        })
        const userMail = req.body.email

        const userData = await user.save();
        
        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bjnh478@gmail.com",
                pass: "upgo mrlo ocar vyah",
            }
        });

        function generateOTP() {
            const min = 100000; // Minimum 6-digit number
            const max = 999999; // Maximum 6-digit number
            const otp = Math.floor(Math.random() * (max - min + 1)) + min;
          
            return otp;
          }
          
          generatedOtp = generateOTP();

        let details = {
            from: "bjnh478@gmail.com",
            to: req.body.email,
            subject: "OTP Verification",
            text: `Your OTP is ${generatedOtp}`,
        }

        mailTransporter.sendMail(details, (err) => {
            if(err){
                console.log("sending otp have an error");
            } else {
                console.log("otp sended successfully");
                res.render('verifyOtp', { userMail: userMail });
            }
        })

    } catch (error) {
        console.log(error);
    }
}

// verify the OTP
const confirmOtp = async (req,res) => {
    const userMail = req.query.usermail
    let userOtp = req.query.dig1+req.query.dig2+req.query.dig3+req.query.dig4+req.query.dig5+req.query.dig6
    if(userOtp == generatedOtp){
        // console.log(userMail);
        const user = await User.findOne({ email:userMail})
        if(!user){
            console.log('user not found');
            console.log(userMail);
        }

        user.isVerified = true;
        await user.save();
        res.redirect('/login_page');
        
        
    } else {
        console.log('otp incorrect');
        console.log(generatedOtp);
        console.log(userOtp);
        // console.log(userMail);
    }
}

// check user loggedIn or not
const checkUser = async (req,res) => {
    try {
        console.log("on checkuser section");
        if(req.cookies.isLoggedIn){
            res.redirect('/home')
        } else {
            res.redirect('/login_page')
        }
    } catch (error) {
        console.log(error);
    }
}

// validate login request
const validateLogin = async (req,res) => {
    try {
        const password = req.query.password
        const check = await User.findOne({email:req.query.email});
        // const isVerified = check.isVerified

        if(check){
            const isValid = await bcrypt.compare(password, check.password);
            if(check.isVerified != true){
                res.render('logIn',{passMessage:"user not verified"});
            } else if(!isValid) {
                res.render('logIn',{passMessage:"invalid password"});
            }else if(check.status === false){
                res.render('logIn',{passMessage:"your account has been blocked by admin"})
            } else {
                res.cookie('isLoggedIn', true, { maxAge: 24 * 60 * 60 * 1000 });
                const products = await Products.find();
                res.render("home",{products});
            }
        }else{
            console.log('mail is invalid');
            res.render('logIn',{mailMessage:"mail not found"})
        }
    } catch (error) {
        console.log(error);
    }
}

const listUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.render('users',{users});
    } catch (error) {
        console.log(error);
    }
}

const block = async (req, res) => {
    try {
        const check = await User.findOne({ _id: req.query.id }); // Use req.query.id
        console.log(req.query.id); // Log the ID to check
        console.log(check);
        check.status = false;
        const userData = await check.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.log(error);
    }
}

const unblock = async (req,res) => {
    try {
        const check = await User.findOne({ _id: req.query.id }); // Use req.query.id
        console.log(req.query.id); // Log the ID to check
        console.log(check);
        check.status = true;
        const userData = await check.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.log(error);
    }
}

const loadProduct = async (req,res) => {
    try {
        const product = await Products.findOne({_id:req.query.id});
        console.log(product);
        res.render('productDetails',{product});
    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req,res) => {
    try {
        res.clearCookie("isLoggedIn");
        res.redirect('login_page');
    } catch (error) {
        console.log(error);
    }
}

// export modules
module.exports = {
    loadLogin,
    loadSignup,
    loadHome,
    insertUser,
    checkUser,
    validateLogin,
    confirmOtp,
    listUsers,
    block,
    unblock,
    loadProduct,
    logOut
}