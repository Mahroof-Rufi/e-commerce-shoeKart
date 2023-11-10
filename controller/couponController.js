const Coupon = require('../model/couponModel');

const renderCoupons = async (req,res) => {
    try {
        const coupons = await Coupon.find({});
        res.render('coupons',{coupons});
    } catch (error){
        console.log(error);
    }
  }
  
  const renderAddCoupon = async (req,res) => {
    try {
      res.render('addCoupon');
    } catch (error) {
      console.log(error);
    }
  }
  
  const addCoupon = async (req,res) => {
    try {
        console.log('this is the coupon inserting function');
        const newCoupon = Coupon({
            code: req.body.couponCode,
            discountValue: req.body.discountValue,
            description: req.body.description,
            activationDate: req.body.activationDate,
            expireDate: req.body.expireDate,
            minPurchaseAmount: req.body.minPurchaseAmount,
            totalUsageLimit: req.body.totalUsageLimit,
      })
        

      await newCoupon.save();
      res.redirect('/admin/coupons');

    } catch (error) {
      console.log(error);
    }
  }

const renderEditCoupon = async (req,res) => {
    try {
        const couponId = req.query.id;

        const coupon = await Coupon.findOne({ _id:couponId });
        res.render('editCoupon',{coupon});
    } catch (error) {
        console.log(error);
    }
}

const updateCoupon = async (req,res) => {
    try {
        const newData = {
            id: req.body.id,
            code: req.body.code,
            discountValue: req.body.discountValue,
            description: req.body.description,
            activationDate: req.body.activationDate,
            expireDate: req.body.expireDate,
            minPurchaseAmount: req.body.minPurchaseAmount,
            totalUsageLimit: req.body.totalUsageLimit,
        }

        const {id, ...updatedData} = newData

        const result = await Coupon.updateOne(
            {_id:id},
            { $set: updatedData },
            { upsert:true, new:true }
        );

        if (result) {
            console.log('here the updated data');
            console.log(result);
            res.redirect('/admin/coupons');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    renderCoupons,
    renderAddCoupon,
    addCoupon,
    renderEditCoupon,
    updateCoupon
}