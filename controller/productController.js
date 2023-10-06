const Products = require('../model/productsModel');
const Sharp = require('sharp');

const listProducts = async (req,res) => {
    try {
      const products = await Products.find();
        res.render('products',{products})
    } catch (error) {
        console.log(error);
    }
}

const loadAddProduct = async (req,res) => {
    try {
        res.render('addProduct');
    } catch (error) {
        console.log(error);
    }
}

const addProduct = async (req, res) => {
    try {
      let details =  req.body;
      const files = await req.files;
      console.log('hey',details);
      
  
      const img = [
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
        files.image4[0].filename,
      ];
  
      for (let i = 0; i < img.length; i++) {
        
        await Sharp("./public/products/images/" + img[i])
          .resize(500, 500)
          .toFile("./public/products/croped/" + img[i]);
      }
  
      let product = new Products({
        name: details.name,
        price: details.price,
        stock: details.stock,
        category: details.category,
        description: details.description,
        "images.image1": files.image1[0].filename,
        "images.image2": files.image2[0].filename,
        "images.image3": files.image3[0].filename,
        "images.image4": files.image4[0].filename,
      });
  
      let result = await product.save();
      console.log(result);
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  };

  const loadEditProduct = async (req,res) => {
    try {
      const product = await Products.findOne({_id:req.query.id});
      res.render('editProduct',{product});
    } catch (error) {
      console.log(error);
    }
  }

  const editProduct = async (req,res) => {
    try {
      console.log("on product editing section");
      const product = await Products.findOne({_id:req.body.id});
      const files = await req.files;
      

        product.name = req.body.name;
        product.price = req.body.price;
        product.stock = req.body.stock;
        product.category = req.body.category;
        product.description = req.body.description;
        product.images.image1 = files.image1[0].filename;
        product.images.image2 = files.image2[0].filename;
        product.images.image3 = files.image3[0].filename;
        product.images.image4 = files.image4[0].filename;

        
      const data = await product.save();
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  }

  const deleteProduct = async (req,res) => {
    try {
      const product = await Products.findByIdAndDelete(req.query.id);
      res.redirect('/admin/products');
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    listProducts,
    loadAddProduct,
    addProduct,
    loadEditProduct,
    editProduct,
    deleteProduct
}