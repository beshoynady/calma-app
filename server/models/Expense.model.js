const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

const ExpenseModel = mongoose.model('Expense', expenseSchema);

module.exports = ExpenseModel;
