const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  shiftType: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'], 
    required: true,
  },
  isOvertime: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    maxlength: 500,
  }
});

const ShiftModel = mongoose.model('Shift', shiftSchema);

module.exports = ShiftModel;