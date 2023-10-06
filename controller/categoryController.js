const Category = require('../model/categoryModel');

const listCategories = async (req,res) => {
    try {
        const categories = await Category.find();
        res.render('categories',{categories})
    } catch (error) {
        console.log(error);
    }
}

const loadAddCategory = async (req,res) => {
    try {
        res.render('addNewCategory');
    } catch (error) {
        console.log(error);
    }
}

const addNewCategory = async (req,res) => {
    try {
        console.log(req.body.name);
        const newCategory = { name:req.body.name, status:true }
        const category = new Category(newCategory);
        await category.save();
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
    }
}

const editCategory = async (req,res) => {
    try {
        const category = await Category.findOne({_id:req.query.id});
        if (!category) {
            console.log(`Category not found for ID`);
        } else {
            console.log(category); // Check the category object in the console
            res.render('categoryEdit', { category });
        }
    } catch (error) {
        console.log(error);
    }
}

const updateCategory = async (req,res) => {
    try {
        const category = await Category.findOne({_id:req.body.id});
        category.name = req.body.name;
        const userData = await category.save();
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
    }
}

const block = async (req,res) => {
    try {
        const check = await Category.findOne({ _id: req.query.id }); // Use req.query.id
        console.log(req.query.id); // Log the ID to check
        console.log(check);
        check.status = false;
        const userData = await check.save();
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
    }
}

const unblock = async (req,res) => {
    try {
        const check = await Category.findOne({ _id: req.query.id }); // Use req.query.id
        console.log(req.query.id); // Log the ID to check
        console.log(check);
        check.status = true;
        const userData = await check.save();
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
    }
}

const deleteCategory = async (req,res) => {
    try {
        const user = await Category.findByIdAndDelete(req.query.id);
        res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    listCategories,
    loadAddCategory,
    addNewCategory,
    editCategory,
    updateCategory,
    block,
    unblock,
    deleteCategory
}