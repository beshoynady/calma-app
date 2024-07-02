const MenuCategoryModel = require('../models/MenuCategory.model');

// Create a new Menucategory
const createMenuCategory = async (req, res, next) => {
    try {
        const { name, isMain, status } = req.body;
        const id = req.employee.id;
        const newMenuCategory = await MenuCategoryModel.create({ name, isMain, status, createdBy: id });
        res.status(201).json(newMenuCategory);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'MenuCategory name already exists' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Failed to create Menucategory' });
        next(error);
    }
};

// Get all Menucategories
const getAllMenuCategories = async (req, res, next) => {
    try {
        const allMenuCategories = await MenuCategoryModel.find({}).sort('order').populate('createdBy');

        res.status(200).json(allMenuCategories);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Failed to fetch Menucategories' , error});
        next(error);
    }
};

// Get a single Menucategory by ID
const getOneMenuCategory = async (req, res, next) => {
    const { menuCategoryId } = req.params;
    try {
        const Menucategory = await MenuCategoryModel.findById(menuCategoryId).populate('createdBy');
        if (!Menucategory) {
            return res.status(404).json({ message: 'MenuCategory not found' });
        }
        res.status(200).json(Menucategory);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Failed to fetch Menucategory' });
        next(error);
    }
};

// Update a Menucategory
const updateMenuCategory = async (req, res, next) => {
    const { menuCategoryId } = req.params;
    const { name, isMain, status , order } = req.body;
    const id = req.employee.id;
    try {
        const updatedMenuCategory = await MenuCategoryModel.findByIdAndUpdate(
            menuCategoryId,
            { name, isMain,order, status, createdBy: id },
            { new: true }
        );
        if (!updatedMenuCategory) {
            return res.status(404).json({ message: 'MenuCategory not found' });
        }
        res.status(200).json(updatedMenuCategory);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'MenuCategory name already exists' });
        }
        // Handle other errors
        res.status(500).json({ message: 'Failed to update Menucategory' ,error});
        next(error);
    }
};

// Delete a Menucategory
const deleteMenuCategory = async (req, res, next) => {
    const { menuCategoryId } = req.params;
    try {
        const deletedMenuCategory = await MenuCategoryModel.findByIdAndDelete(menuCategoryId);
        if (!deletedMenuCategory) {
            return res.status(404).json({ message: 'MenuCategory not found' });
        }
        res.status(200).json(deletedMenuCategory);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Failed to delete Menucategory' });
        next(error);
    }
};

module.exports = {
    createMenuCategory,
    getAllMenuCategories,
    getOneMenuCategory,
    updateMenuCategory,
    deleteMenuCategory
};
