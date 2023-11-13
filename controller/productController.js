const Products = require('../model/productsModel');
const Cart = require('../model/cartModel');
const Sharp = require('sharp');

const listProducts = async (req,res) => {
    try {
        const currentPage = req.query.page || 1;
        const itemsPerPage = 9;
        const totalDoc = await Products.countDocuments();
        const skip = (currentPage - 1) * itemsPerPage;

        const products = await Products.find().skip(skip).limit(itemsPerPage);
        const cartProducts = await Cart.findOne({user:req.session.user});
        res.render('products',{products,cartProducts,currentPage: parseInt(currentPage),totalPages: Math.ceil(totalDoc / itemsPerPage),});
    } catch (error) {
        console.log(error);
    }
}

const listInAdminside = async (req,res) => {
  try {
      const products = await Products.find({});
      res.render('products',{products});

  } catch (error) {
    
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
      console.log(product);
      if (!product) {
        // Handle the case where the product is not found
        res.status(404).send('Product not found');
        return;
      }
      res.render('editProduct',{product});
    } catch (error) {
      console.log(error);
    }
  }

  const editProduct = async (req,res) => {
    try {
      console.log("on product editing section");
      const productData = await Products.findOne({_id:req.body.id});
      console.log(productData);
      const imagesFiles = await req.files;

        const img = [
          imagesFiles.image1 ? imagesFiles.image1[0].filename : productData.images.image1,
          imagesFiles.image2 ? imagesFiles.image2[0].filename : productData.images.image2,
          imagesFiles.image3 ? imagesFiles.image3[0].filename : productData.images.image3,
          imagesFiles.image4 ? imagesFiles.image4[0].filename : productData.images.image4,
        ];

        for (let i = 0; i < img.length; i++) { 
          await Sharp("./public/products/images/" + img[i])
            .resize(500, 500)
            .toFile("./public/products/croped/" + img[i]);
        }

      let img1 = imagesFiles.image1 ? imagesFiles.image1[0].filename : productData.images.image1;
      let img2 = imagesFiles.image2 ? imagesFiles.image2[0].filename : productData.images.image2;
      let img3 = imagesFiles.image3 ? imagesFiles.image3[0].filename : productData.images.image3;
      let img4 = imagesFiles.image4 ? imagesFiles.image4[0].filename : productData.images.image4;

      await Products.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            "images.image1": img1,
            "images.image2": img2,
            "images.image3": img3,
            "images.image4": img4,
          },
        }
      );

      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  }

  const filterProducts = async (req,res) => {
    try {
      const selectedItems = req.body.selectedItems.split(',');
      const maxPrice = req.body.maxPrice+1;
      console.log(maxPrice);
        const filterQuery = {
            $and: [{category: { $in: selectedItems }},{ price: { $lt: maxPrice}}]
        };
        const products = await Products.find(filterQuery);
        const cartProducts = await Cart.findOne({user: req.session.user});

        console.log(products);
        res.render("products",{products,cartProducts});
    } catch (error) {
        console.log(error);
    }
  }

  const searchProduct = async (req,res) => {
    try {
        const selectedItem = req.body.searchedItems;

        const filterQuery = {
          $or: [
            { category: { $regex: new RegExp(selectedItem, "i") } },
            { name: { $regex: new RegExp(selectedItem, "i") } },
          ]
        };

        const cartProducts = await Cart.findOne({user: req.session.user});

        const products = await Products.find(filterQuery);

        console.log(products);

        res.render("products",{products,cartProducts});
    } catch (error) {
        console.log(error);
    }
  }

  const deleteProduct = async (req,res) => {
    try {
      const product = await Products.findByIdAndDelete({_id:req.query.id});
      res.redirect('/admin/products');
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    listProducts,
    listInAdminside,
    loadAddProduct,
    addProduct,
    loadEditProduct,
    editProduct,
    searchProduct,
    deleteProduct,
    filterProducts,
}