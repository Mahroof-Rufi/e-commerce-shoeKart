// require modules
const User = require("../model/usersModel");
const Products = require("../model/productsModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const Coupon = require("../model/couponModel");
const Wishlist = require("../model/wishlistModel");
const Banner = require("../model/bannerModel");
const OTP = require("../model/otpModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const { default: mongoose } = require("mongoose");


// create an instance of razorpay for online payments
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

//<================================== login(users) ==========================================>

const loadLogin = async (req,res) => {
    try {
        res.render("logIn");
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
};

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
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== signup(users) =========================================>

const loadSignup = async (req,res) => {
    try {
        res.render("signUp")
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const insertUser = async(req,res) => {

    try {
        const toCheck = await User.findOne({email:req.body.email});
        if( !toCheck || toCheck.isVerified === false){
            console.log('entered the if case');
            const hashedPass = await bcrypt.hash(req.body.password, 13);
            const user ={
                fname:req.body.fname,
                lname:req.body.lname,
                username:req.body.fname,
                email:req.body.email,
                phone:req.body.phone,
                gender:req.body.gender,
                password:hashedPass,
                isVerified:false,
                status:true,
                wallet:{
                    balance:0
                }
            }

            console.log('before the insert user');
            const userMail = req.body.email
            const userData = await User.updateOne(
                { email: userMail }, 
                { $set: user },      
                { upsert: true, new: true }
            );
            console.log('inserted user success');
            console.log(userData);
            if (userData.modifiedCount > 0 || userData.upsertedCount > 0) {
                console.log('data modified or upserted');
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
              
            const generatedOtp = generateOTP();

            const data = {
                email: userMail,
                otp: generatedOtp,
                expiration: Date.now(),
            };

            await OTP.create( data );
    
            let details = {
                from: "bjnh478@gmail.com",
                to: userMail,
                subject: "OTP Verification",
                text: `Your OTP is ${generatedOtp}`,
            }
    
            mailTransporter.sendMail(details, (err) => {
                if(err){
                    console.log('sending otp failed');
                    throw new Error('sending OTP have some error, try again later');
                } else {
                    console.log('otp sent successfully');
                    res.render('verifyOtp', { userMail: userMail });
                }
            })
        }

        } else {
            console.log('user exist already');
            res.render("signUp",{errorMessage:"email already taken"});
        }
        
    } catch (error) {
        console.log(error);
        res.render('error',{ errorMessage:error.message });
    }
}



const confirmOtp = async (req,res) => {
    try {
        const userMail = req.body.usermail
    let userOtp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4+req.body.dig5+req.body.dig6
    const otp = await OTP.findOne({ email: userMail });
    if(userOtp == otp.otp){
        // console.log(userMail);
        const user = await User.findOne({ email:userMail})
        if(!user){
            throw new Error('user not found');
        }

        user.isVerified = true;
        req.session.user = user._id
        req.session.username = user.fname
        await user.save();
        await OTP.findOneAndDelete({ email: userMail });
        res.redirect('/');
        
    } else {
        throw new Error('sending OTP have some issue, try again');
    }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== Home(users) ===========================================>

// const checkUser = async (req,res) => {
//     try {
//         console.log("on checkuser section");
//         if(req.sess.user){
//             res.redirect('/home')
//         } else {
//             res.redirect('/login')
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

const loadHome = async (req,res) => {
    try {
        const mens = await Products.find({ category: { $regex: /\bmen\b/i } });
        const womens = await Products.find({ category: { $regex: /\bwomen\b/i } });
        const kids = Products.find({ category: { $regex: /\bkid\b/i } });
        const products = await Products.find();
        const userId = req.session.user;
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        const banners = await Banner.find({status:true});
        const username = req.session.username
        res.render("home",{products:products,cartProducts,username,banners,mens,womens,kids});

    } catch (error) {
        console.error(error);
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================ product details(users) ==================================>

const loadProduct = async (req,res) => {
    try {
        const product = await Products.findOne({_id:req.query.id});
        const similarProducts = await Products.find({ category:product.category });
        const username = req.session.username;
        const userId = req.session.user;
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        res.render('productDetails',{product,cartProducts,similarProducts,username});
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<===================== forgott password in login page(users) ==============================>

const loadResetPass = async (req,res) => {
    try {
        res.render('resetPass');
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const validateEmail = async (req,res) => {
    try {
        const bodyMail = req.body.email
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
              
              const generatedOtp = generateOTP();
                const data = {
                    email: bodyMail,
                    otp: generatedOtp,
                    expiration: Date.now(),
                };
                await OTP.findOneAndDelete({ email: bodyMail });
                await OTP.create( data );
              
    
            let details = {
                from: "bjnh478@gmail.com",
                to: bodyMail,
                subject: "OTP Verification",
                text: `Your OTP is ${generatedOtp}`,
            }
    
            mailTransporter.sendMail(details, (err) => {
                if(err){
                    throw new Error('sending OTP have some issue, try again');
                } else {
                    res.render('resetPassOtp', { userMail: bodyMail });
                }
            })
        } else {
            res.render('resetPass',{message:"email not found"})
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const confirmResetOtp = async (req,res) => {
    try {
        const userMail = req.body.usermail
        let userOtp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4+req.body.dig5+req.body.dig6
        const otp = await OTP.findOne(
            { email: userMail }
        )
        if(userOtp == otp.otp){
            await OTP.findOneAndDelete({ email: userMail });
            res.render('changePass',{userMail:userMail});
        
        } else {
            throw new Error('incorrect OTP');
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
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
            throw new Error('user not found');
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<===================================== wishlist(users) ====================================>

const addToWishlist = async (req,res) => {
    try {
        const userId = req.session.user;
        const productId = req.query.id;

        const result = await Wishlist.findOneAndUpdate(
            { userId: userId },
            { $addToSet: { products: { product_id: productId } } },
            { upsert: true, new: true }
        );             
        
        if (result) {
            res.json({success:true})
        } else {
            throw new Error('something went wrong, try again later');
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const loadWishlist = async (req,res) => {
    try {
        const userId = req.session.user;
        const wishlist = await Wishlist.findOne({ userId: userId })
          .populate('products.product_id');
        const wishlistProducts = wishlist ? wishlist.products : 0;
        const username = req.session.username 
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        res.render('wishlist',{cartProducts,wishlistProducts,username});

    } catch (error) {
        console.log(error);
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== profile(users) ========================================>

const loadProfile = async (req,res) => {
    try {
        const username = req.session.username;
        const userId = req.session.user;
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        const user = await User.findOne({_id:new mongoose.Types.ObjectId(userId)});
        const orders = await Order.find({user_Id:req.session.user}).sort({purchaseDate:-1});

        user.wallet.transactionHistory.sort((a, b) => b.transactionDate - a.transactionDate);
      
        res.render("profile",{cartProducts,user,username,orders:orders});
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
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
        res.render('error',{ errorMessage:error.message });
    }
}

const loadChangePass = async (req,res) => {
    try {
        res.render('newPass');
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
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
        res.render('error',{ errorMessage:error.message });
    }
}

const loadNewMail = async (req,res) => {
    try {
        res.render("newMail");
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

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
          
          const generatedOtp = generateOTP();
          const data = {
            email: email,
            otp: generatedOtp,
            expiration: Date.now(),
          };
        await OTP.findOneAndDelete({ email: email });
        await OTP.create( data );

        let details = {
            from: "bjnh478@gmail.com",
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is ${generatedOtp}`,
        }

        mailTransporter.sendMail(details, (err) => {
            if(err){
                throw new Error('send OTP have an Error, try again');
            } else {
                res.render('verifyNewMail', { userMail: email });
            }
        })
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const verifyNewMailOtp = async (req,res) => {
    try {
        const userMail = req.body.usermail
        let userOtp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4+req.body.dig5+req.body.dig6
        const otp = await OTP.findOne({ email:userMail });
        if(userOtp == otp.otp){
            const user = await User.findOne({_id:req.session.user});
            user.email = userMail
            await user.save()
            await OTP.findOneAndDelete({ email:userMail });
            res.redirect('/profile');
        } else {
            res.render('verifyNewMail',{message: "incorrect OTP"});
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== profile address(users) ================================>

const addNewAddress = async (req,res) => {
    try {
        // console.log("on address insert sedction");
        const userId = req.session.user;
        const newAddress = {
            fullName:req.body.fullname,
            mobile:req.body.mobile,
            houseName:req.body.housename,
            colony:req.body.colony,
            city:req.body.city,
            state:req.body.state,
            pin:req.body.pincode,
        }

        if (newAddress) {
            const result = await User.findOneAndUpdate(
                { _id: userId }, // Search for the user by username
                { $push: { addresses: newAddress } }, // Push the new address subdocument to the addresses array
                { upsert: true }) // create if it doesn't exist

                if (result) {
                    res.redirect('/profile')
                } else {
                    throw new Error('something went wrong, try again later');
                }

        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const deleteAddress = async (req,res) => {
    try {
        // console.log("on address deletion ");
        // console.log(req.params.id);
        const userId = req.session.user;
        const addressIdToDelete = req.params.id;
        const deleteResult = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { addresses: { _id: addressIdToDelete } } }
        );
        // console.log(deleteResult);

        if (deleteResult) {
            res.json({result:true});
        } else {
            res.json({result:false});
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================= profile wallet(users) ==================================>

const addMonetToWallet = async (req,res) => {
    try {

        const userId = req.session.user;
        const addAmount = req.body.amount;
        const newTransactionHistory = {
            amount: addAmount,
            direction: 'added',
            transactionDate: Date.now(),
            confirm: false
        }

        const result = await User.findOneAndUpdate(
            { _id: userId },
            {
              $push: {
                'wallet.transactionHistory': newTransactionHistory
              },
            },
            { upsert: true, new: true }
        );

        if (result) {
            const recentlyAddedTransaction = result.wallet.transactionHistory[result.wallet.transactionHistory.length - 1];
            const options = {
                amount: recentlyAddedTransaction.amount*100,
                currency: 'INR',
                receipt: recentlyAddedTransaction._id + "",
            };
            razorpayInstance.orders.create(options, (err, addMoney) => {
                if (err) {
                    res.json({ sucess:false })
                } else {
                    res.json({ addMoney,result:recentlyAddedTransaction });
                }
            });
        } else {
            res.json({success:false});
        }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const deleteFailedTransaction = async (req,res) => {
    try {
        const userId = req.session.user;
        const transactionId = req.body.id;
        const user = await User.findOne({ _id:userId });
        const transactionIndex = user.wallet.transactionHistory.findIndex(
            (transaction) => transaction._id.toString() === transactionId
        );
          if (transactionIndex !== -1) {
            const result = user.wallet.transactionHistory.splice(transactionIndex, 1);
            await user.save()
            res.json({ success:true });
          } else {
            res.json({ success:false });
          }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<================================== checkout(users) =======================================>

const renderCheckout = async (req,res) => {
    const cartProducts = await Cart.findOne({ user: req.session.user });
    try {
        const userId = req.session.user;
        const shippingMethod = req.body.shipping;
        const couponDetail = req.body.couponDetail;
        const discount = req.body.discount;
        const username = req.session.username
        const userData = await User.findOne({ _id:userId });
        const addresses = userData.addresses;
        const walletBalance = userData.wallet.balance;
        var errorIndex;
        const fetchProductDetails = async () => {
        for (const [index, product] of Object.entries(cartProducts.products)) {
            const productDetails = await Products.findOne({ _id: product.product_id });
            if (productDetails.stock == 0) {
                errorIndex = index
                return `out of stock`
            } else if (productDetails.stock < product.count) {
                errorIndex = index
                return `only ${productDetails.stock} left`
            }
        }
        };
        let theErrorMess;
        if (cartProducts) {
            theErrorMess = await fetchProductDetails();
        }
        const stockError = {};
        const coupons = await Coupon.find({});
        if (theErrorMess) {
            stockError[errorIndex] = theErrorMess;
            res.render('cart', { stockError,cartProducts,coupons });
        } else {
            res.render('checkout',{username,cartProducts,addresses,shippingMethod,discount,couponDetail,walletBalance});
        }
    } catch (error) {
        console.log(error);
        res.render('error',{ errorMessage:error.message ,cartProducts});
    }
}

//<================================== checkout(users) =======================================>

const addNewAddressFromCheckout = async (req,res) => {
    try {
        const userId = req.session.user;
        const newAddress = {
            fullName: req.body.fullname,
            mobile: req.body.mobile,
            houseName: req.body.housename,
            colony: req.body.colony,
            city: req.body.city,
            state: req.body.state,
            pin: req.body.pincode,
        }

        const result = await User.findOneAndUpdate(
            { _id: userId }, // Search for the user by username
            { $push: { addresses: newAddress } }, // Push the new address subdocument to the addresses array
            { upsert: true, new: true } // create if it doesn't exist
        );
        
        res.json({ success: result });

    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

//<==================================== logout(users) =======================================>

const logOut = async (req, res) => {
    try {
        req.session.user = null;
        req.session.username = undefined;
        res.redirect('/');
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
};

//<==========================================================================================>

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


// export modules
module.exports = {
    loadLogin,
    loadSignup,
    loadHome,
    loadResetPass,
    validateEmail,
    confirmResetOtp,
    updatePass,
    addToWishlist,
    loadWishlist,
    insertUser,
    sendOTP,
    validateLogin,
    confirmOtp,
    loadProduct,
    loadProfile,
    editProfile,
    loadChangePass,
    validateNewPass,
    loadNewMail,
    verifyNewMailOtp,
    renderCheckout,
    addNewAddress,
    addNewAddressFromCheckout,
    addMonetToWallet,
    deleteFailedTransaction,
    deleteAddress,
    logOut
}