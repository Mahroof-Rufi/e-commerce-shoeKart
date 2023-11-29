// require models
const Products = require('../model/productsModel');
const Cart = require('../model/cartModel');
const Category = require('../model/categoryModel');
const Sharp = require('sharp');
const fs = require('fs').promises;

//<================================== viewmore products(users) ==============================>

const listProducts = async (req,res) => {
    try {
        const category = req.query.category || undefined
        const username = req.session.username
        const userId = req.session.user;
      
        const currentPage = req.query.page || 1;
        const itemsPerPage = 9;
        const totalDoc = await Products.countDocuments();
        const skip = (currentPage - 1) * itemsPerPage;

        const categoryRegex = new RegExp(`\\b${category}\\b`, 'i');
        let products;

        if (category) {
          console.log('it is the product fetch if case');
          products = await Products.find({ category: { $regex: categoryRegex } }).skip(skip).limit(itemsPerPage);
        } else {
          console.log('it is the product fetch else case');
          products = await Products.find().skip(skip).limit(itemsPerPage);
        }

        let cartProducts;
        if (userId) {
            cartProducts = await Cart.findOne({user:userId});
            cartProducts = cartProducts === null ? undefined : cartProducts
        } else {
            cartProducts = undefined
        }
        res.render('products',{username,products,cartProducts,currentPage: parseInt(currentPage),totalPages: Math.ceil(totalDoc / itemsPerPage),});
    } catch (error) {
        console.error(error);
        res.render('error',{ errorMessage:error.message });
    }
}

const searchProduct = async (req,res) => {
  try {
      const userId = req.session.user;
      const username = req.session.username
      const selectedItem = req.body.searchedItems;

      const filterQuery = {
        $or: [
          { category: { $regex: new RegExp(selectedItem, "i") } },
          { name: { $regex: new RegExp(selectedItem, "i") } },
        ]
      };

      let cartProducts;
      if (userId) {
        cartProducts = await Cart.findOne({ user:userId });
      } else {
        cartProducts = undefined
      }

      const products = await Products.find(filterQuery);

      res.render("products",{products,cartProducts,username});
  } catch (error) {
      res.render('error',{ errorMessage:error.message });
  }
}

const filterProducts = async (req,res) => {
  try {
    const userId = req.session.user;
    const username = req.session.username
    const selectedItems = req.body.selectedItems.split(',');
    const maxPrice = req.body.maxPrice+1;
      const filterQuery = {
          $and: [{category: { $in: selectedItems }},{ price: { $lt: maxPrice}}]
      };
      const products = await Products.find(filterQuery);
      let cartProducts;
      if (userId) {
        cartProducts = await Cart.findOne({user: req.session.user});
      } else {
        cartProducts = undefined
      }
      res.render("products",{products,cartProducts,username});
  } catch (error) {
      res.render('error',{ errorMessage:error.message });
  }
}

//<==========================================================================================>

//<================================== products(admin) =======================================>

const listInAdminside = async (req,res) => {
  try {
      const products = await Products.find({});
      res.render('products',{products});

  } catch (error) {
    console.error(error);
  }
}

const loadAddProduct = async (req,res) => {
    try {
        const categories = await Category.find({});
        res.render('addProduct',{categories});
    } catch (error) {
      console.error(error);
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
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
    }
  };

  const loadEditProduct = async (req,res) => {
    try {
      const product = await Products.findOne({_id:req.query.id});
      if (!product) {
        throw new Error('product not found');
      }
      res.render('editProduct',{product});
    } catch (error) {
      console.error(error);
    }
  }


const editProduct = async (req, res) => {
  try {
    const productData = await Products.findOne({ _id: req.body.id });
    const imagesFiles = req.files;

    const img = [
      imagesFiles.image1 ? imagesFiles.image1[0].filename : productData.images.image1,
      imagesFiles.image2 ? imagesFiles.image2[0].filename : productData.images.image2,
      imagesFiles.image3 ? imagesFiles.image3[0].filename : productData.images.image3,
      imagesFiles.image4 ? imagesFiles.image4[0].filename : productData.images.image4,
    ];

    for (let i = 0; i < img.length; i++) {
      const imagePath = `./public/products/images/${img[i]}`;

      try {
        await fs.access(imagePath); // Use fs.promises.access for newer Node.js versions
        await Sharp(imagePath)
          .resize(500, 500)
          .toFile(`./public/products/croped/${img[i]}`);
      } catch (err) {
        console.error(`Input file is missing: ${imagePath}`);
      }
    }

    const img1 = imagesFiles.image1 ? imagesFiles.image1[0].filename : productData.images.image1;
    const img2 = imagesFiles.image2 ? imagesFiles.image2[0].filename : productData.images.image2;
    const img3 = imagesFiles.image3 ? imagesFiles.image3[0].filename : productData.images.image3;
    const img4 = imagesFiles.image4 ? imagesFiles.image4[0].filename : productData.images.image4;

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
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

  

  const deleteProductImage = async (req, res) => {
    try {
      const productId = req.params.id;
      const imageToDelete = req.params.img;

      const result = await Products.findByIdAndUpdate(
        { _id: productId },
        { $unset: { [`images.${imageToDelete}`]: 1 } },
        { new: false }
      );
  
      const filePath1 = `./public/products/images/${result.images[imageToDelete]}`;
      const filePath2 = `./public/products/croped/${result.images[imageToDelete]}`;
  
      await Promise.all([
        fs.unlink(filePath1).catch((err) => {
          throw new Error('image delete from the path 1 is failed' + err);
        }),
        fs.unlink(filePath2).catch((err) => {
          throw new Error('image delete from the path 2 is failed' + err);
        })
      ]).catch(() => {
        throw new Error('operation failed, Please try again')
      })
      
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (req, res) => {
    try {
      const product = await Products.findByIdAndDelete({ _id: req.query.id });
  
      const images = product.images;
  
      // Create an array to store promises for fs.unlink operations
      const unlinkPromises = [];
  
      for (const key in images) {
        const filename = images[key];
        const filePath1 = `./public/products/images/${filename}`;
        const filePath2 = `./public/products/croped/${filename}`;
  
        // Push promises to the array
        unlinkPromises.push(
          fs.unlink(filePath1).catch((err) => {
            console.error(`Image delete from path 1 failed for ${filename}:`, err);
          }),
          fs.unlink(filePath2).catch((err) => {
            console.error(`Image delete from path 2 failed for ${filename}:`, err);
          })
        );
      }

      await Promise.all(unlinkPromises).then(() => {
        res.redirect('/admin/products');
      })
  
    } catch (error) {
      console.error(error);
    }
  };
  

//<==========================================================================================>

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
    deleteProductImage
}