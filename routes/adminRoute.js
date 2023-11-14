const express = require('express');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const admin_route = express()

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));
admin_route.use(express.static('public'));

// middleware for prevent noSql query injection
admin_route.use(mongoSanitizer());

// middleware for prevent site script xss
admin_route.use(xss());

const adminController = require("../controller/adminController");
const categoryController = require("../controller/categoryController");
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const orderController = require("../controller/orderController");
const couponController = require("../controller/couponController");
const bannerController = require("../controller/bannerController");

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
admin_route.get('/products',adminAuth.isAuth,productController.listInAdminside);
admin_route.get('/add_product',adminAuth.isAuth,productController.loadAddProduct);
admin_route.post('/add_product',adminAuth.isAuth,multer.productImagesUpload,productController.addProduct);
admin_route.get('/edit_product',adminAuth.isAuth,productController.loadEditProduct);
admin_route.post('/edit_product',adminAuth.isAuth,multer.productImagesUpload,productController.editProduct);
admin_route.get('/delete_product',adminAuth.isAuth,productController.deleteProduct);
admin_route.get('/orders',adminAuth.isAuth,orderController.renderOrders);
admin_route.get('/orderDetails',adminAuth.isAuth,adminController.renderOrderDetails);
admin_route.post('/update_sts',adminAuth.isAuth,adminController.updateOrderStatus);
admin_route.post('/cancel_order',adminAuth.isAuth,adminController.cancelOrder);
admin_route.get('/sales',adminAuth.isAuth,adminController.renderSales);
admin_route.get('/filter-sales/:val',adminAuth.isAuth,adminController.filterSales);
admin_route.get('/coupons',adminAuth.isAuth,couponController.renderCoupons);
admin_route.delete('/coupons',adminAuth.isAuth,couponController.deleteCoupon)
admin_route.get('/add_coupon',adminAuth.isAuth,couponController.renderAddCoupon);
admin_route.post('/add_coupon',adminAuth.isAuth,couponController.addCoupon);
admin_route.put('/add_coupon',adminAuth.isAuth,couponController.updateCoupon);
admin_route.get('/edit_coupon',adminAuth.isAuth,couponController.renderEditCoupon);
admin_route.get('/banners',adminAuth.isAuth,bannerController.renderBanners);
admin_route.delete('/banners',adminAuth.isAuth,bannerController.deleteBanner);
admin_route.put('/banners',adminAuth.isAuth,multer.bannerImageUpload,bannerController.editBanner);
admin_route.patch('/banners',adminAuth.isAuth,bannerController.changeStatus);
admin_route.get('/add_banner',adminAuth.isAuth,bannerController.renderAddBanner);
admin_route.get('/edit_banner',adminAuth.isAuth,bannerController.renderEditBanner);
admin_route.post('/banners',adminAuth.isAuth,multer.bannerImageUpload,bannerController.addBanner);
admin_route.get('/logout',adminController.logOut);

module.exports = admin_route 