const mongoose = require('mongoose');

// Define the category schema
const MenuCategorySchema = new mongoose.Schema({
    // Category name
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        unique: [true, 'Category name already exists.'],
        trim: true,
        maxlength: [30, 'Category name must be less than 30 characters.'],
        minlength: [3, 'Category name must be at least 3 characters.']
    },
    // Flag indicating if it's a main category
    isMain: {
        type: Boolean,
        default: false
    },
    // Category status
    status: {
        type: Boolean,
        default: true
    },
    // Reference to the user who created the category
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    // Order index for sorting
    order: {
        type: Number,
        required: [true, 'Order is required.']
    }
}, { timestamps: true });

// Pre-save middleware to set the order to the last position if not provided
MenuCategorySchema.pre('save', async function (next) {
    if (this.isNew) {
        const highestOrderCategory = await mongoose.model('Category').findOne().sort('-order').exec();
        this.order = highestOrderCategory ? highestOrderCategory.order + 1 : 1;
    }
    next();
});

// Create the Category model
const Categorymodel = mongoose.model('MenuCategory', MenuCategorySchema)

// Export the Category model
module.exports = Categorymodel
