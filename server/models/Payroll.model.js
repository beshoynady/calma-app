const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const payrollSchema = new mongoose.Schema({
  Year: {
    type: Number,
    required: true,
    default: 0,
  },
  Month: {
    type: Number,
    required: true,
    default: 0,
  },
  employeeId: {
    type: ObjectId,
    ref: 'Employee',
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    min: 0,
    default: 0,
  },
  Bonus: {
    type: Number,
    min: 0,
    default: 0,
  },
  OvertimeDays: {
    type: Number,
    min: 0,
    default: 0,
  },
  OvertimeValue: {
    type: Number,
    min: 0,
    default: 0,
  },
  TotalDue: {
    type: Number,
    min: 0,
    default: 0,
  },
  AbsenceDays: {
    type: Number,
    min: 0,
    default: 0,
  },
  AbsenceDeduction: {
    type: Number,
    min: 0,
    default: 0,
  },
  Deduction: {
    type: Number,
    min: 0,
    default: 0,
  },
  Predecessor: {
    type: Number,
    min: 0,
    default: 0,
  },
  Insurance: {
    type: Number,
    min: 0,
    default: 0,
  },
  Tax: {
    type: Number,
    min: 0,
    default: 0,
  },
  TotalDeductible: {
    type: Number,
    min: 0,
    default: 0,
  },
  NetSalary: {
    type: Number,
    min: 0,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidBy: {
    type: ObjectId,
    ref: 'Employee',
  },
},
  {
    timestamps: true,
  });

const PayrollModel = mongoose.model('Payroll', payrollSchema);

module.exports = PayrollModel;
