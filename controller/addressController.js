const Address = require('../model/addressModel');

const validateNewAddress = async (req,res) => {
    try {
        // console.log("on address insert sedction");
        const userAddress = await Address.findOne({userId:req.session.user});
        console.log(userAddress);
        const address = {
            fullName:req.body.fullname,
            mobile:req.body.mobile,
            houseName:req.body.housename,
            colony:req.body.colony,
            city:req.body.city,
            state:req.body.state,
            pin:req.body.pincode,
        }

        if (userAddress) {
            userAddress.address.push(address);
            await userAddress.save()
        } else {
            const newAdress = new Address({
                userId:req.session.user,
                address:[address],
            });
            await newAdress.save();
        }

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}

const deleteAddress = async (req,res) => {
    try {
        console.log("on address deletion ");
        console.log("address id is :"+req.params.id);
        const userAddress = await Address.findOne({userId:req.session.user});
        console.log("user address is :"+userAddress);
        const addressIndex = userAddress.address.findIndex(adrs => adrs._id == req.params.id);
        console.log(addressIndex);

    if (addressIndex !== -1) {
        userAddress.address.splice(addressIndex, 1);
        await userAddress.save();
        console.log("deletion success");
        res.json({result:true});
    } else {
        console.log("deletion failed");
            res.json({result:false});
            }
    } catch (error) {
       console.log(error); 
    }
}

module.exports = {
    validateNewAddress,
    deleteAddress
}