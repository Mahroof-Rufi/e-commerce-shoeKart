const Category = require('../model/categoryModel');


//<================================== category(admin) =======================================>

const listCategories = async (req,res) => {
    try {
        const categories = await Category.find();
        res.render('categories',{categories})
    } catch (error) {
        console.error(error);
    }
}

const loadAddCategory = async (req,res) => {
    try {
        res.render('addNewCategory');
    } catch (error) {
        console.error(error);
    }
}

const addNewCategory = async (req,res) => {
    try {
        const submittedName = req.body.name
        const check = await Category.findOne({ name: { $regex: new RegExp(submittedName, 'i') } });
        if(!check){
            const newCategory = { name:req.body.name, status:true }
            const category = new Category(newCategory);
            await category.save();
            res.redirect('/admin/category');
        } else {
            res.render("addNewCategory",{message:"category already exists"});
        }
    } catch (error) {
        console.error(error);
    }
}

const editCategory = async (req,res) => {
    try {
        const categoryId = req.body.id;
        const category = await Category.findOne({_id:categoryId});

        if (!category) {
            throw new Error('category not found');
        } else {
            res.render('categoryEdit', { category });
        }
    } catch (error) {
        console.error(error);
    }
}

const updateCategory = async (req,res) => {
    try {
        const categoryId = req.body.id;
        const category = await Category.findOne({_id:categoryId});
        const submittedName = req.body.name
        const check = await Category.findOne({ name: { $regex: new RegExp(submittedName, 'i') } });
        if (!check) {
            category.name = submittedName
            const userData = await category.save();
            res.redirect('/admin/category');
        } else {
            res.render("addNewCategory",{message:"category already exists"});
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteCategory = async (req,res) => {
    try {
        const user = await Category.findByIdAndDelete(req.body.id);
        res.redirect('/admin/category');
    } catch (error) {
        console.error(error);
    }
}

//<==========================================================================================>

// const block = async (req,res) => {
//     try {
//         const check = await Category.findOne({ _id: req.query.id }); // Use req.query.id
//         console.log(req.query.id); // Log the ID to check
//         console.log(check);
//         check.status = false;
//         const userData = await check.save();
//         res.redirect('/admin/category');
//     } catch (error) {
//         console.log(error);
//     }
// }

// const unblock = async (req,res) => {
//     try {
//         const check = await Category.findOne({ _id: req.query.id }); // Use req.query.id
//         console.log(req.query.id); // Log the ID to check
//         console.log(check);
//         check.status = true;
//         const userData = await check.save();
//         res.redirect('/admin/category');
//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = {
    listCategories,
    loadAddCategory,
    addNewCategory,
    editCategory,
    updateCategory,
    // block,
    // unblock,
    deleteCategory
}