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

admin_route.get('/',adminController.loadLogin);
admin_route.get('/login',adminController.checkLogin);
admin_route.get('/dashboard',adminController.loadDashboard);
admin_route.get('/users',userController.listUsers);
admin_route.get('/user_block',userController.block);
admin_route.get('/user_unblock',userController.unblock);
admin_route.get('/category',categoryController.listCategories);
admin_route.get('/category_block',categoryController.block);
admin_route.get('/category_unblock',categoryController.unblock);
admin_route.get('/add_category',categoryController.loadAddCategory);
admin_route.post('/add_new',categoryController.addNewCategory);
admin_route.get('/edit',categoryController.editCategory);
admin_route.post('/update_category',categoryController.updateCategory);
admin_route.get('/category_delete',categoryController.deleteCategory);
admin_route.get('/products',adminController.listProducts);


module.exports = admin_route 