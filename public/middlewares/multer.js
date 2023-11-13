const  multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/products/images");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const productImagesUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);


const bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/banners");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadBanner = multer({ storage: bannerStorage });
const bannerImageUpload = uploadBanner.fields([
  { name: "banner", maxCount: 1 }
]);


module.exports = { 
  productImagesUpload,
  bannerImageUpload
  }