// require modules
const express = require('express');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const admin_route = express()


// setup view engine
admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');


// setup middleware
admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));
admin_route.use(express.static('public'));
admin_route.use(mongoSanitizer());  // middleware for prevent noSql query injection
admin_route.use(xss());  // middleware for prevent site script xss


// require controllers
const adminController = require("../controller/adminController");
const categoryController = require("../controller/categoryController");
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const orderController = require("../controller/orderController");
const couponController = require("../controller/couponController");
const bannerController = require("../controller/bannerController");


// require custom middlewares
const multer = require("../public/middlewares/multer");
const adminAuth = require("../public/middlewares/adminAuth");


// set routes
//<================================== login ======================================>
admin_route.get('/login',adminController.loadLogin);
admin_route.post('/login',adminController.validateLogin);
//<===============================================================================>

//<================================== dashboard ==================================>
admin_route.get('/',adminAuth.isAuth,adminController.Login);

//<================================== users ======================================>
admin_route.get('/users',adminAuth.isAuth,adminController.listUsers);
admin_route.post('/user_action',adminAuth.isAuth,adminController.userAction);

//<================================== category ===================================>
admin_route.get('/category',adminAuth.isAuth,categoryController.listCategories);
admin_route.get('/add_category',adminAuth.isAuth,categoryController.loadAddCategory);
admin_route.post('/add_category',adminAuth.isAuth,categoryController.addNewCategory);
admin_route.post('/edit',adminAuth.isAuth,categoryController.editCategory);
admin_route.post('/update_category',adminAuth.isAuth,categoryController.updateCategory);
admin_route.post('/delete',adminAuth.isAuth,categoryController.deleteCategory);

//<================================== products ===================================>
admin_route.get('/products',adminAuth.isAuth,productController.listInAdminside);
admin_route.get('/add_product',adminAuth.isAuth,productController.loadAddProduct);
admin_route.post('/add_product',adminAuth.isAuth,multer.productImagesUpload,productController.addProduct);
admin_route.get('/edit_product',adminAuth.isAuth,productController.loadEditProduct);
admin_route.post('/edit_product',adminAuth.isAuth,multer.productImagesUpload,productController.editProduct);
admin_route.delete('/edit_product/:id/:img',adminAuth.isAuth,productController.deleteProductImage);
admin_route.get('/delete_product',adminAuth.isAuth,productController.deleteProduct);

//<================================== orders =====================================>
admin_route.get('/orders',adminAuth.isAuth,orderController.renderOrders);
admin_route.get('/orderDetails',adminAuth.isAuth,orderController.OrderDetails);
admin_route.post('/update_sts',adminAuth.isAuth,orderController.updateOrderStatus);
admin_route.post('/cancel_order',adminAuth.isAuth,orderController.cancelOrderAdmin);

//<================================== sales ======================================>
admin_route.get('/sales',adminAuth.isAuth,adminController.renderSales);
admin_route.get('/filter-sales/:val',adminAuth.isAuth,adminController.filterSales);
admin_route.get('/save_report/:duration/:format',adminAuth.isAuth,adminController.downloadSalesReport);

//<================================== coupons ====================================>
admin_route.get('/coupons',adminAuth.isAuth,couponController.renderCoupons);
admin_route.get('/add_coupon',adminAuth.isAuth,couponController.renderAddCoupon);
admin_route.post('/add_coupon',adminAuth.isAuth,couponController.addCoupon);
admin_route.put('/add_coupon',adminAuth.isAuth,couponController.updateCoupon);
admin_route.get('/edit_coupon',adminAuth.isAuth,couponController.renderEditCoupon);
admin_route.delete('/coupons',adminAuth.isAuth,couponController.deleteCoupon);

//<================================== banners ====================================>
admin_route.get('/banners',adminAuth.isAuth,bannerController.renderBanners);
admin_route.put('/banners',adminAuth.isAuth,multer.bannerImageUpload,bannerController.editBanner);
admin_route.patch('/banners',adminAuth.isAuth,bannerController.changeStatus);
admin_route.get('/add_banner',adminAuth.isAuth,bannerController.renderAddBanner);
admin_route.get('/edit_banner',adminAuth.isAuth,bannerController.renderEditBanner);
admin_route.post('/banners',adminAuth.isAuth,multer.bannerImageUpload,bannerController.addBanner);
admin_route.delete('/banners',adminAuth.isAuth,bannerController.deleteBanner);

//<================================== logout =====================================>
admin_route.get('/logout',adminController.logOut);


// export the modules
module.exports = admin_route 