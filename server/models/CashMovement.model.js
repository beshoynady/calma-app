const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cashMovementSchema = new mongoose.Schema({
  registerId: {
    type: ObjectId,
    ref: 'CashRegister',
    required: true,
  },
  createBy: {
    type: ObjectId,
    ref: 'Employee',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdraw', 'Revenue', 'Transfer'],
    required: true,
  },
  description: {
    type: String,
  },
  transferTo: {
    type: ObjectId,
    ref: 'CashRegister',
  },
  transferFrom: {
    type: ObjectId,
    ref: 'CashRegister',
  },
  movementId: {
    type: ObjectId,
    ref: 'CashMovement'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Rejected'],
    required: true,
    default: 'Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const CashMovement = mongoose.model('CashMovement', cashMovementSchema);

module.exports = CashMovement;
