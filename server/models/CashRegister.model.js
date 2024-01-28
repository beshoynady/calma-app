const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cashRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employee: {
    type: ObjectId,
    ref: 'Employee',
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CashRegister = mongoose.model('CashRegister', cashRegisterSchema);

module.exports = CashRegister;
