// require models
const Cart = require("../model/cartModel");
const Coupon = require("../model/couponModel");
const Product = require("../model/productsModel");


//<================================== cart(users) ===========================================>

const loadCart = async (req,res) => {
    try {
        const userId = req.session.user
        const coupons = await Coupon.find({});
        const username = req.session.username
        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        res.render("cart",{ cartProducts,coupons,stockError:"",username });
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const addProduct = async (req,res) => {
    try {
        // console.log("on controller");
        const user_id = req.session.user;
        // console.log(user_id);
        const product_id = req.body.id
        // console.log(product_id);
        const productData = await Product.findOne({_id:product_id});
        const cartData = await Cart.findOne({ user: user_id ,"products.product_id":product_id});

        if (productData.stock > 0) {
            if (cartData) {
                res.json({result:true})    
            } else {
                const data={
                    product_id:product_id,
                    name:productData.name,
                    category:productData.category,
                    price:productData.price,
                    count:1,
                    image:productData.images.image1
                }
                await Cart.findOneAndUpdate(
    
                    { user: user_id },
                    {
                      $set: { user: user_id },
                      $push: { products: data }
                    },
                    { upsert: true, new: true }
        
                );
                res.json({result:true})    
            }
        }else{
            res.json({result:false})
        }   
         
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const deleteProduct = async (req,res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user });

        if (!cart) {
            return res.json({ result: false});
        }

        const productIndex = cart.products.findIndex(product => product.product_id === req.body.id);
        // console.log("finded product is :"+product);
    if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.json({result:true});
    } else {
            res.json({result:false});
            }
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const changeQuantity = async (req,res) => {
    try {
        const product = await Product.findOne({_id:req.query.id});
        const user_id = req.session.user
        if (req.query.val > 0) {
            if ((product.stock - req.query.count) > 0) {
                await Cart.updateOne(
                    { user: user_id, "products.product_id": req.query.id },
                    { $inc: { "products.$.count": 1 } },
                );
                res.json({result:true});
            } else {
                res.json({message:false});
            }
        } else if (req.query.val < 0){
            if (req.query.count > 1) {
                await Cart.updateOne(
                    { user: user_id, "products.product_id": req.query.id },
                    { $inc: { "products.$.count": -1 } },
                );
                res.json({result:true});
            }
        }
    } catch (error) {
        res.json({result:false});
    }
}

//<==========================================================================================>


module.exports = {
    addProduct,
    deleteProduct,
    loadCart,
    changeQuantity
}