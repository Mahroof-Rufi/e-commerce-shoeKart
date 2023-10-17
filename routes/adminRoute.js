const express = require('express');
const admin_route = express()
const cookirParser = require('cookie-parser');

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));
admin_route.use(express.static('public'));
admin_route.use(cookirParser());

const adminController = require("../controller/adminController");
const categoryController = require("../controller/categoryController");
const userController = require("../controller/userController");
const productController = require("../controller/productController");

const multer = require("../public/middlewares/multer");
const adminAuth = require("../public/middlewares/adminAuth");

admin_route.get('/',adminAuth.isAuth,adminController.Login);
admin_route.get('/login',adminController.loadLogin);
admin_route.post('/login',adminController.validateLogin);
// admin_route.get('/dashboard',adminController.loadDashboard);
admin_route.get('/users',adminAuth.isAuth,userController.listUsers);
admin_route.post('/user_action',adminAuth.isAuth,userController.userAction);
admin_route.get('/category',adminAuth.isAuth,categoryController.listCategories);
// admin_route.get('/category_block',categoryController.block);
// admin_route.get('/category_unblock',categoryController.unblock);
admin_route.get('/add_category',adminAuth.isAuth,categoryController.loadAddCategory);
admin_route.post('/add_category',adminAuth.isAuth,categoryController.addNewCategory);
admin_route.post('/edit',adminAuth.isAuth,categoryController.editCategory);
admin_route.post('/update_category',adminAuth.isAuth,categoryController.updateCategory);
admin_route.post('/delete',adminAuth.isAuth,categoryController.deleteCategory);
admin_route.get('/products',adminAuth.isAuth,productController.listProducts);
admin_route.get('/add_product',adminAuth.isAuth,productController.loadAddProduct);
admin_route.post('/add_product',adminAuth.isAuth,multer.productImagesUpload,productController.addProduct);
admin_route.get('/edit_product',adminAuth.isAuth,productController.loadEditProduct);
admin_route.post('/edit_product',adminAuth.isAuth,multer.productImagesUpload,productController.editProduct);
admin_route.get('/delete_product',adminAuth.isAuth,productController.deleteProduct);
admin_route.get('/logout',adminController.logOut);

module.exports = admin_route 