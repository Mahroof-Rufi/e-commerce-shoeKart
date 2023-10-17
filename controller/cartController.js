const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");

const addProduct = async (req,res) => {
    try {
        // console.log("on controller");
        const user_id = req.session.user;
        // console.log(user_id);
        const product_id = req.body.id
        // console.log(product_id);
        const productData = await Product.findOne({_id:product_id})
        console.log(productData);
        const cartData = await Cart.findOne({ user: user_id ,"products.product_id":product_id})
        console.log(cartData);

        if (productData.stock > 0) {
            if (cartData) {
                console.log("on existing cart data");
                await Cart.updateOne(
                    { user: user_id, "products.product_id": product_id },
                    { $inc: { "products.$.count": 1 } },
                )
                console.log("cart product count increased");
                // res.json({result:true})
            } else {
                console.log("on data inserting");
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
        
                )
                console.log("product added to cart");
            }
            res.json({result:true})    
        }else{
            console.log("product is out of stock");
            res.json({result:false})
        }   
         
    } catch (error) {
        console.log(error);
    }
}

const deleteProduct = async (req,res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user });

        if (!cart) {
            return res.json({ result: false});
        }

        const productIndex = cart.products.findIndex(product => product.product_id === req.body.id);

    if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        console.log("deletion success");
        res.json({result:true});
    } else {
        console.log("deletion failed");
            res.json({result:false});
            }
    } catch (error) {
        console.log("something happened");
        console.log(error);
    }
}

const loadCart = async (req,res) => {
    try {
        const products = await Cart.findOne({user:req.session.user});
        console.log("founded product of this user"+products);
        res.render("cart",{cartProducts:products});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addProduct,
    deleteProduct,
    loadCart
}