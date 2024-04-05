const CategoryModel = require('../models/Category.model');

// Create a new category
const createCategory = async (req, res, next) => {
    try {
        const { name, isMain, status, order } = req.body;
        const id = req.employee.id;
        const newCategory = await CategoryModel.create({ name, isMain, status, order, createdBy: id });
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category name already exists' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Failed to create category' });
        next(error);
    }
};

// Get all categories
const getAllCategories = async (req, res, next) => {
    try {
        const allCategories = await CategoryModel.find({}).populate('createdBy').sort({ order: 1 });

        res.status(200).json(allCategories);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Failed to fetch categories' });
        next(error);
    }
};

// Get a single category by ID
const getOneCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    try {
        const category = await CategoryModel.findById(categoryId).populate('createdBy');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Failed to fetch category' });
        next(error);
    }
};

// Update a category
const updateCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const { name, isMain, status, order } = req.body;
    const id = req.employee.id;
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            categoryId,
            { name, isMain, status, order, createdBy: id },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category name already exists' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Failed to update category' });
        next(error);
    }
};

// Delete a category
const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    try {
        const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(deletedCategory);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Failed to delete category' });
        next(error);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getOneCategory,
    updateCategory,
    deleteCategory
};
