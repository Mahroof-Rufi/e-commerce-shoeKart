const Catogory = require('../model/categoryModel');
const Banner = require('../model/bannerModel');
const fs = require('fs');

const renderBanners = async (req,res) => {
    try {
        const banners = await Banner.find({});
        res.render('banners',{banners});
    } catch (error) {
        console.log(error);
    }
}

const renderAddBanner = async (req,res) => {
    try {
        const categories = await Catogory.find({});
        res.render('addBanner',{categories});
    } catch (error) {
        console.log(error);
    }
}

const addBanner = async (req,res) => {
    try {
        const details = req.body;
        const image = await req.files
        console.log('here the add banner details');
        console.log(details);
        console.log(image);

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
            throw Error('The new banner insert failed');
        }

        
    } catch (error) {
        console.log(error);
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
                  console.error('Error deleting file:', err);
                } else {
                  console.log('File deleted successfully!');
                }
              });
        res.redirect('/admin/banners');
    } catch (error) {
        console.log(error);
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

    console.log(result);

    if (result.modifiedCount > 0) {
      console.log('Document updated successfully');
    } else {
      console.log('No document updated');
    }

    res.redirect('/admin/banners');
  } catch (error) {
    console.log(error);
  }
};

const renderEditBanner = async (req,res) => {
    try {
        const bannerId = req.query.id;
        const banner = await Banner.findOne({_id:bannerId});
        const categories = await Catogory.find({});
        res.render('editBanner',{banner,categories});
    } catch (error) {
        console.log(error);
    }
}

const editBanner = async (req,res) => {
    try {
        console.log('this is the banner edit function');
        const details = req.body;
        const images = await req.files
        console.log(details);
        console.log(images);

        const bannerId = details.id;
        let image;
        let status;

        if (Object.keys(images).length !== 0) {
            image = images.banner[0].filename
            const filePath = `./public/images/banners/${details.currentImg}`
            fs.unlink(filePath, (err) => {
                if (err) {
                  console.error('Error deleting file:', err);
                } else {
                  console.log('File deleted successfully!');
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

            console.log(bannerId);
            console.log(banner);

        console.log(result);
        res.redirect('/admin/banners');
            

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    renderBanners,
    renderAddBanner,
    addBanner,
    deleteBanner,
    changeStatus,
    renderEditBanner,
    editBanner
}