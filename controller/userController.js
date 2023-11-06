// require modules
const User = require("../model/usersModel");
const Products = require("../model/productsModel");
const Cart = require("../model/cartModel");
const Address = require("../model/addressModel");
const Order = require("../model/orderModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

// load login page
const loadLogin = async (req,res) => {
    try {
        res.render("logIn");
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
        const products = await Products.find();
        const cartProducts = await Cart.findOne({user:req.session.user});
        // console.log(cartProducts);
        const username = req.session.username
        res.render("home",{products:products,cartProducts:cartProducts,username});

    } catch (error) {
        console.log(error);
    }
}

const loadResetPass = async (req,res) => {
    try {
        res.render('resetPass');
    } catch (error) {
        console.log(error);
    }
}

const validateEmail = async (req,res) => {
    try {
        const bodyMail = req.body.email
        console.log(bodyMail);
        const check = await User.find({email:bodyMail});

        if (check) {
            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "bjnh478@gmail.com",
                    pass: process.env.GMAIL_PASS,
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
                to: bodyMail,
                subject: "OTP Verification",
                text: `Your OTP is ${generatedOtp}`,
            }
    
            mailTransporter.sendMail(details, (err) => {
                if(err){
                    console.log("sending otp have an error");
                } else {
                    console.log("otp sended successfully");
                    res.render('resetPassOtp', { userMail: bodyMail });
                    console.log("successfully rendered");
                }
            })
        } else {
            res.render('resetPass',{message:"email not found"})
        }
    } catch (error) {
        console.log(error);
    }
}

let generatedOtp;

const sendOTP = async (req,res) => {
    try {
        const email = req.body.email
        // console.log(email);
        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bjnh478@gmail.com",
                pass: process.env.GMAIL_PASS,
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
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is ${generatedOtp}`,
        }

        mailTransporter.sendMail(details, (err) => {
            if(err){
                console.log("sending otp have an error");
            } else {
                console.log("otp sended successfully");
                res.render('verifyNewMail', { userMail: email });
                console.log("successfully rendered");
            }
        })
    } catch (error) {

        console.log(error);
    }
}

const confirmResetOtp = async (req,res) => {
    try {
        const userMail = req.body.usermail
        let userOtp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4+req.body.dig5+req.body.dig6
        if(userOtp == generatedOtp){
            
            res.render('changePass',{userMail:userMail});
        
        } else {
            console.log('otp incorrect');
        }
    } catch (error) {
        console.log(error);
    }
}

const updatePass = async (req,res) => {
    try {
        const data = await User.findOne({email:req.body.usermail});
        const hashedPass = await bcrypt.hash(req.body.confirmPassword, 13);
        if (data) {
            data.password = hashedPass
            await data.save();
            res.redirect('/login');
        } else {
            console.log("user not found");
        }
    } catch (error) {
        console.log(error);
    }
}

// insert user data to database
const insertUser = async(req,res) => {

    try {
        const toCheck = await User.findOne({email:req.body.email});
        if(!toCheck){
            const hashedPass = await bcrypt.hash(req.body.password, 13);
        const user = new User({
            fname:req.body.fname,
            lname:req.body.lname,
            username:req.body.fname,
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
                    pass: process.env.GMAIL_PASS,
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
                to: userMail,
                subject: "OTP Verification",
                text: `Your OTP is ${generatedOtp}`,
            }
    
            mailTransporter.sendMail(details, (err) => {
                if(err){
                    console.log("sending otp have an error");
                } else {
                    console.log("otp sended successfully");
                    res.render('verifyOtp', { userMail: userMail });
                    console.log("successfully rendered");
                }
            })
        } else {
            res.render("signUp",{errorMessage:"email already taken"});
        }
        
    } catch (error) {
        console.log(error);
    }
}

// verify the OTP
const confirmOtp = async (req,res) => {
    const userMail = req.body.usermail
    let userOtp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4+req.body.dig5+req.body.dig6
    if(userOtp == generatedOtp){
        // console.log(userMail);
        const user = await User.findOne({ email:userMail})
        if(!user){
            console.log('user not found');
            console.log(userMail);
        }

        user.isVerified = true;
        req.session.user = user._id
        req.session.username = user.fname
        await user.save();
        res.redirect('/');
        
    } else {
        console.log('otp incorrect');
        // console.log(generatedOtp);
        // console.log(userOtp);
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
        const {email,password} = req.body
        const check = await User.findOne({email:email});

        if(check){
            const isValid = await bcrypt.compare(password, check.password);
            if(check.isVerified != true){
                res.render('logIn',{passMessage:"user not verified"});
            } else if(!isValid) {
                res.render('logIn',{passMessage:"invalid password"});
            }else if(check.status === false){
                res.render('logIn',{passMessage:"your account has been blocked by admin"})
            } else {
                req.session.user = check._id
                req.session.username = check.fname
                const products = await Products.find();
                res.redirect('/');
            }
        }else{
            res.render('logIn',{mailMessage:"email not found"})
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

const userAction = async (req, res) => {
    try {
        const check = await User.findOne({ _id: req.body.id });
        if(check.status === true){
            check.status = false
            req.session.user = null
        } else {
            check.status = true
        }
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
        const cartProducts = await Cart.findOne({user:req.session.user});
        const similarProducts = await Products.find({ category:product.category });
        console.log(product);
        res.render('productDetails',{product,cartProducts,similarProducts});
    } catch (error) {
        console.log(error);
    }
}

const loadProfile = async (req,res) => {
    try {
        const cartProducts = await Cart.findOne({user:req.session.user});
        const user = await User.findOne({_id:req.session.user});
        const userAddress = await Address.findOne({userId:req.session.user});
        const username = req.session.username

        const orders = await Order.find({user_Id:req.session.user}).sort({purchaseDate:-1});
        res.render("profile",{cartProducts,user,username,userAddress,orders:orders});
    } catch (error) {
        console.log(error);
    }
}

const editProfile = async (req,res) => {
    try {
        const user = await User.findOne({_id:req.session.user});
        user.fname = req.body.fname
        user.lname = req.body.lname
        user.username = req.body.username
        user.gender = req.body.gender
        user.phone = req.body.phone

        await user.save()
        res.redirect('/profile');

    } catch (error) {
        console.log(error);
    }
}

const loadChangePass = async (req,res) => {
    try {
        res.render('newPass');
    } catch (error) {
        console.log(error);
    }
}

const validateNewPass = async (req,res) => {
    try {
        const check = await User.findOne({_id:req.session.user});
        const userPass = req.body.currentPass;
        const isValid = await bcrypt.compare(userPass, check.password);
        if (!isValid) {
            res.render('newPass',{currentPassMessage:"invalid password"});
        } else {
            if (req.body.newPass !== req.body.confPass) {
                res.render('newPass',{message:"password should be same"});
            }
            const hashed = await bcrypt.hash(req.body.newPass, 13);
            check.password = hashed
            check.save()
            res.redirect('/profile');
        }
    } catch (error) {
        console.log(error);
    }
}

const loadNewMail = async (req,res) => {
    try {
        res.render("newMail");
    } catch (error) {
        console.log(error);
    }
}

const verifyNewMailOtp = async (req,res) => {
    try {
        const userMail = req.body.usermail
        console.log("this is the user new mail:"+userMail);
        let userOtp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4+req.body.dig5+req.body.dig6
        if(userOtp == generatedOtp){
            const user = await User.findOne({_id:req.session.user});
            user.email = userMail
            await user.save()
            res.redirect('/profile');
        } else {
            res.render('verifyNewMail',{message: "incorrect OTP"});
        }
    } catch (error) {
        console.log(error);
    }
}

const renderCheckout = async (req,res) => {
    try {
        const shippingMethod = req.body.shipping;
        console.log("on checkout section");
        const userName = req.session.username
        console.log("username is :"+userName);
        const cartProducts = await Cart.findOne({user:req.session.user});
        console.log("cart products is:"+cartProducts);
        const userAddress = await Address.findOne({userId:req.session.user});
        console.log("address is :"+userAddress);
        res.render('checkout',{userName,cartProducts,userAddress,shippingMethod});
    } catch (error) {
        console.log(error);
    }
}

const renderOrderDetails = async (req,res) => {
    try {
        const fname = req.session.username
        const orders = await Order.find({_id:req.query._id});
        const orderProducts = await Order.find({user_Id:req.session.user});
        console.log("ordered products is :"+orderProducts);
        const cartProducts = await Cart.findOne({user:req.session.user});
        res.render('orderDetails',{orders,cartProducts,orderProducts,fname});
    } catch (error) {
        console.log(error);
    }
}

const renderOrderSuccess = async (req,res) => {
    try {
        res.render('orderSuccess');
    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req,res) => {
    try {
        req.session.user = null
        req.session.username = undefined
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

// export modules
module.exports = {
    loadLogin,
    loadSignup,
    loadHome,
    loadResetPass,
    validateEmail,
    confirmResetOtp,
    updatePass,
    insertUser,
    sendOTP,
    checkUser,
    validateLogin,
    confirmOtp,
    listUsers,
    userAction,
    unblock,
    loadProduct,
    loadProfile,
    editProfile,
    loadChangePass,
    validateNewPass,
    loadNewMail,
    verifyNewMailOtp,
    renderCheckout,
    renderOrderDetails,
    renderOrderSuccess,
    logOut
}