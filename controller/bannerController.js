const Catogory = require('../model/categoryModel');
const Banner = require('../model/bannerModel');
const fs = require('fs');

//<================================== banners(admin) ========================================>

const renderBanners = async (req,res) => {
    try {
        const banners = await Banner.find({});
        res.render('banners',{banners});
    } catch (error) {
        res.render('error',{ errorMessage:error.message })
    }
}

const editBanner = async (req,res) => {
    try {
        const details = req.body;
        const images = await req.files

        const bannerId = details.id;
        let image;
        let status;

        if (Object.keys(images).length !== 0) {
            image = images.banner[0].filename
            const filePath = `./public/images/banners/${details.currentImg}`
            fs.unlink(filePath, (err) => {
                if (err) {
                    throw new Error('file deletion failed, please try again later')
                }
              });
          } else {
            image = details.currentImg
          }

        if (details.status == 'true') {
            status = true
        } else {
            status = false
        }


        const banner = {
            image: image,
            subtile: details.subtitle,
            text: details.text,
            priceText: details.priceText,
            category: details.category,
            status: status
        }

        const result = await Banner.findOneAndUpdate(
            { _id: bannerId },
            { $set: { image:banner.image, subtile:banner.subtile,text:banner.text, priceText:banner.priceText,category:banner.category,status:banner.status  } },
            { new: true }
        );

        res.redirect('/admin/banners');

    } catch (error) {
        res.render('error',{ errorMessage:error.message })
    }
}

const changeStatus = async (req, res) => {
    try {
      const bannerId = req.body.id;
      const newStatus = req.body.status;
  
      const result = await Banner.updateOne(
        { _id: bannerId },
        { $set: { status: newStatus } }
      );
  
      if (result.modifiedCount > 0) {
        res.redirect('/admin/banners');
      } else {
        throw new Error('something went wrong, Please try again later')
      }
  
    } catch (error) {
        res.render('error',{ errorMessage:error.message })
    }
  };

  const renderAddBanner = async (req,res) => {
    try {
        const categories = await Catogory.find({});
        res.render('addBanner',{categories});
    } catch (error) {
        res.render('error',{ errorMessage:error.message })
    }
}

const renderEditBanner = async (req,res) => {
    try {
        const bannerId = req.query.id;
        const banner = await Banner.findOne({_id:bannerId});
        const categories = await Catogory.find({});
        res.render('editBanner',{banner,categories});
    } catch (error) {
        res.render('error',{ errorMessage:error.message })
    }
}

const addBanner = async (req,res) => {
    try {
        const details = req.body;
        const image = await req.files

        const banner = {
            image: image.banner[0].filename,
            subtile: details.subtitle,
            text: details.text,
            priceText: details.priceText,
            category: details.category,
            status:true
        }

        const result = await Banner.create(
             banner 
        );

        if (result) {
            res.redirect('/admin/banners')
        } else {
            throw Error('Operation failed');
        }

        
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

const deleteBanner = async (req,res) => {
    try {
        const id = req.body.id;
        const image = req.body.image;
        await Banner.findOneAndDelete({_id:id});
        const filePath = `./public/images/banners/${image}`
            fs.unlink(filePath, (err) => {
                if (err) {
                  throw new Error('file deletion failed');
                }
              });
        res.redirect('/admin/banners');
    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

module.exports = {
    renderBanners,
    renderAddBanner,
    addBanner,
    deleteBanner,
    changeStatus,
    renderEditBanner,
    editBanner
}