// require modules
const Admin = require('../model/adminModel');
const User = require('../model/usersModel');
const Order = require('../model/orderModel');
const Products = require('../model/productsModel');

const loadLogin = async (req,res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
    }
}

const Login = async (req,res) => {
    try {
        console.log('on the dashboard fn');
        let orders = await Order.find({});
        let totalOrders = orders.length;
        let users = await User.find({});
        let totalUsers = users.length;
        let totalRevenue = 0
        let totalSoldProduct = 0

        for (var i = 0; i < orders.length; i++) {
            if (orders[i].status == 'delivered') {
                totalRevenue += orders[i].totalAmount
                for (let product of orders[i].products) {
                    totalSoldProduct += product.count;
                }
            }
        }
        // fetch the total order count on every months 
        const monthlyOrderCounts = await Order.aggregate([
            {
              $group: {
                _id: { $dateToString: { format: '%m', date: '$purchaseDate' } },
                count: { $sum: 1 },
              },
            },
          ]);

        // fetch the total delivered orders count on every month 
        const monthlyDeliveredOrderCounts = await Order.aggregate([
            {
              $match: {
                status: 'delivered',
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%m', date: '$purchaseDate' } },
                count: { $sum: 1 },
              },
            },
          ]);

        // fetch the total cancelled orders count on every month 
          const monthlyCancelledOrderCounts = await Order.aggregate([
            {
              $match: {
                status: 'cancelled',
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%m', date: '$purchaseDate' } },
                count: { $sum: 1 },
              },
            },
          ]);

        // correct the total orders count on every month 
          let indx1 = 0;
          const monthlyData = [];

          if(monthlyOrderCounts.length !=0){
            for(let i=0;i<12;i++){
    
              if(i+1<monthlyOrderCounts[0]._id){
                monthlyData.push(0)
              }else{
                if( monthlyOrderCounts[indx1]){
                  let count = monthlyOrderCounts[indx1].count
                  monthlyData.push(count)
                }else{
                  monthlyData.push(0)
                }
                indx1++
              }
            }
          }

        // correct the total delivered orders count on every month 
          let indx2 = 0;
          const deliveredData = [];

          if(monthlyDeliveredOrderCounts.length !=0){
            for(let i=0;i<12;i++){
    
              if(i+1<monthlyDeliveredOrderCounts[0]._id){
                deliveredData.push(0)
              }else{
                if( monthlyDeliveredOrderCounts[indx2]){
                  let count = monthlyDeliveredOrderCounts[indx2].count
                  deliveredData.push(count)
                }else{
                  deliveredData.push(0)
                }
                indx2++
              }
            }
          }

        // correct the total cancelled orders count on every month 
          let indx3 = 0;
          const cancelledData = [];

          if(monthlyCancelledOrderCounts.length !=0){
            for(let i=0;i<12;i++){
    
              if(i+1<monthlyCancelledOrderCounts[0]._id){
                cancelledData.push(0)
              }else{
                if( monthlyCancelledOrderCounts[indx3]){
                  let count = monthlyCancelledOrderCounts[indx3].count
                  cancelledData.push(count)
                }else{
                  cancelledData.push(0)
                }
                indx3++
              }
            }
          }

        // find count of wallet payments orders
        const walletPayments = await Order.find({ paymentMethod: 'wallet payment' });
        const walletCount = walletPayments.length;

        // find count of online payments orders 
        const onlinePayments = await Order.find({ paymentMethod: 'Online payment'});
        const onlineCount = onlinePayments.length;

        // find count of cash on delivery orders 
        const codDelivery = await Order.find({ paymentMethod: 'Cash on delivery'});
        const codCount = codDelivery.length;

        const paymentMethods = [walletCount,onlineCount,codCount];

        // find count of delivered orders 
        const deliveredOrders = await Order.find({ status: 'delivered' });
        const deliveredOrdersCount = deliveredOrders.length;

        // find count of cancelled orders 
        const cancelledOrders = await Order.find({ status: 'cancelled' });
        const cancelledOrdersCount = cancelledOrders.length;

        // find count of returned orders 
        const returnedOrders = await Order.find({ status: 'returned' });
        const returnedOrdersCount = returnedOrders.length;

        const deliveryMethods = [deliveredOrdersCount,cancelledOrdersCount,returnedOrdersCount];
        console.log('here the delivery methods');
        console.log(deliveryMethods);

        const jsonData = {
            totalOrders: totalOrders,
            totalUsers: totalUsers,
            totalRevenue: totalRevenue,
            totalSoldProduct: totalSoldProduct,
          };
          console.log('here the aggregated data');
          console.log(monthlyOrderCounts);
          console.log('here the edited data');
          console.log(monthlyData);
          
        const datas = JSON.stringify(jsonData);
        res.render('dashboard',{datas,monthlyData,deliveredData,cancelledData,paymentMethods,deliveryMethods});
    } catch (error) {
        console.log(error);
    }
}

const validateLogin = async (req,res) => {
    try {
        // console.log("on admin logincheck section");
        const adminData = await Admin.findOne({email:req.body.email});

        if(!adminData){
            // console.log(req.query.email);
            // console.log(adminData);
            res.render("login",{message : "invalid mail"});
        } else {
            if(adminData.password === req.body.password){
                req.session.admin = adminData._id
                res.redirect('/admin');
            } else {
                res.render("login",{message : "invalid password"});
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const loadDashboard = async (req,res) => {
    try {
        res.render('dashboard');
    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req,res) => {
    try {
        req.session.admin = null
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
}

const renderOrderDetails = async (req,res) => {
    try {
        const orders = await Order.find({_id:req.query.id});
        console.log("the query id is:"+req.query.id);
        console.log("order details is :"+orders);
        const orderProducts = await Order.find({user_Id:req.session.user});
        res.render('orderDetails',{orders,orderProducts});
    } catch (error) {
        console.log(error);
    }
}

const updateOrderStatus = async (req,res) => {
    try {
        const newStatus = req.body.data;
        console.log("on the status updation section");
        console.log("new status is :"+newStatus);
        const order = await Order.findOne({_id:req.body.id});
        console.log("the order data is :"+order);
        if (newStatus == 'cancelled') {
            console.log("on cancel if case");
            const products = order.products
            for (let i = 0; i < products.length; i++) {
                console.log("on loop of if case");
                // const productToUpdate = await Products.findOne({_id:products[i].product_id});
                await Products.findOneAndUpdate(
    
                    { _id: products[i].product_id },
                    {
                        $inc: { stock: products[i].count } // Use $inc to increment the stock field
                    }
                );
            }
        }
        order.status = newStatus;
        await order.save();
        res.json({result:true});  
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req,res) => {
    try {
        const order = await Order.findOne({_id:req.body.id});
        order.status = 'cancelled'
        await order.save();
        res.json({result:true});
    } catch (error) {
        console.log(error);
    }
}

const renderSales = async (req,res) => {
    try {
        const data = await Order.aggregate([
            {
                $match: {
                    status: "delivered",
                }
            },
            {
                $unwind: "$products"
            },
            {
                $sort: { purchaseDate: -1 },
            },
        ]);
        console.log('here the unwinded data');
        console.log(data);
        res.render('sales',{data});
    } catch (error) {
        console.log(error);
    }
}

const filterSales = async (req,res) => {
    try {
        const duration = req.params.val;
        const currentDate = new Date();
        const startDate = new Date(currentDate - duration * 24 * 60 * 60 * 1000);

        const report = await Order.aggregate([
            {
                $match: {
                    status: "delivered",
                    purchaseDate: { $gte: startDate, $lt: currentDate },
                }
            },
            {
                $unwind: "$products"
            },
            {
                $sort: { purchaseDate: -1 },
            },
        ]);
      
          res.render('sales', { data:report });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    Login,
    loadLogin,
    validateLogin,
    loadDashboard,
    renderOrderDetails,
    updateOrderStatus,
    cancelOrder,
    renderSales,
    filterSales,
    logOut
}