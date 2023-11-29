const Coupon = require('../model/couponModel');

//<================================== coupons(admin) ========================================>

const renderCoupons = async (req,res) => {
    try {
        const coupons = await Coupon.find({});
        res.render('coupons',{coupons});
    } catch (error){
        console.error(error);
    }
  }
  
  const renderAddCoupon = async (req,res) => {
    try {
        res.render('addCoupon');
    } catch (error) {
        console.error(error);
    }
  }
  
  const addCoupon = async (req,res) => {
    try {
        const newCoupon = Coupon({
            code: req.body.couponCode,
            discountValue: req.body.discountValue,
            description: req.body.description,
            activationDate: req.body.activationDate,
            expireDate: req.body.expireDate,
            minPurchaseAmount: req.body.minPurchaseAmount,
            totalUsageLimit: req.body.totalUsageLimit,
            maxDiscountAmount: req.body.maxDiscountAmount
      })

      await newCoupon.save();
      res.redirect('/admin/coupons');

    } catch (error) {
        console.error(error);
    }
  }

const renderEditCoupon = async (req,res) => {
    try {
        const couponId = req.query.id;

        const coupon = await Coupon.findOne({ _id:couponId });
        res.render('editCoupon',{coupon});
    } catch (error) {
        console.error(error);
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
            res.redirect('/admin/coupons');
        } else {
            throw new Error('something went wrong, try again later');
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteCoupon = async (req,res) => {
    try {
        const couponId = req.body.id;
        await Coupon.deleteOne({ _id:couponId });
        res.redirect('/admin/coupons');
    } catch (error) {
        console.error(error);
    }
}

//<==========================================================================================>

//<================================== cart(users) ===========================================>

const addDiscount = async (req,res) => {
    try {
        const userId = req.session.user;
        const couponId = req.body.couponId;
        const totalAmount = req.body.totalAmount;
        const currentDate = Date.now();
        const couponDetails = await Coupon.findOne({ _id:couponId });
        let discountedAmount,discount;
        if ( totalAmount < couponDetails.minPurchaseAmount ) {
            res.json({ minimumPurchaseAmount:false });
        } else if ( currentDate > couponDetails.expireDate ) {
            res.json({ expired:true });
        } else if (couponDetails.usedUsers.some(user => user.userId === userId)) {
            res.json({ used: true });        
        } else if ( couponDetails.totalUsageLimit < 1 ) {
            res.json({ exceed:true });
        } else {
            discountedAmount = parseInt(totalAmount - (totalAmount * couponDetails.discountValue / 100));
            discount = parseInt((couponDetails.discountValue / 100) * totalAmount);
            if (discount > couponDetails.maxDiscountAmount) {
                discountedAmount = totalAmount - couponDetails.maxDiscountAmount
            }
            res.json({discountedAmount,coupon:couponDetails,discount});
        }


    } catch (error) {
        res.render('error',{ errorMessage:error.message });
    }
}

//<==========================================================================================>

module.exports = {
    renderCoupons,
    renderAddCoupon,
    addCoupon,
    renderEditCoupon,
    updateCoupon,
    addDiscount,
    deleteCoupon
}