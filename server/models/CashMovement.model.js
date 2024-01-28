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
    enum: ['Deposit', 'Withdraw','Revenue'],
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{timestamps: true});

const CashMovement = mongoose.model('CashMovement', cashMovementSchema);

module.exports = CashMovement;