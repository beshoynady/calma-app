const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const StockManagSchema = new mongoose.Schema(
  {
    // Item reference ID
    itemId: {
      type: ObjectId,
      ref: 'StockItems',
      required: true,
    },
    // Unit of measurement
    unit: {
      type: String,
      required: true,
    },
    // Type of movement: Purchase, Expense, Return, Wastage
    movement: {
      type: String,
      enum: ['Purchase', 'Expense', 'Return', 'Wastage'],
      required: true,
    },
    // Quantity of stock
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    // Old balance of stock
    oldBalance: {
      type: Number,
      required: true,
    },
    // Current balance of stock
    balance: {
      type: Number,
      required: true,
    },
    // Price of the stock item
    price: {
      type: Number,
      required: true,
    },
    // Old cost of the stock
    oldCost: {
      type: Number,
      required: true,
    },
    // Current cost of the stock
    cost: {
      type: Number,
      required: true,
    },
    // Expiration date of the stock item
    expirationDate: {
      type: Date,
    },
    // Action performed by the user
    actionBy: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    // Timestamp of the action
    actionAt: {
      type: Date,
    },
    // Timestamp of the last update
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StockManagModel = mongoose.model('StockManag', StockManagSchema);
module.exports = StockManagModel;
