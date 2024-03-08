const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const EmployeeSalarySchema = new mongoose.Schema(
  {
    EmployeeId: {
      type: ObjectId,
      ref: 'Employee',
      required: true,
    },
    EmployeeName: {
      type: String,
      required: true,
    },
    movement: {
      type: String,
      enum: ['سلف', 'خصم', 'غياب', 'اضافي', 'مكافأة'],
      required: true,
    },
    Amount: {
      type: Number,
      default: 0,
      required: true,
    },
    oldAmount:{
      type: Number,
      required: true,
    },
    newAmount:{
      type: Number,
      required: true,
    }, 
    actionBy: {
      type: ObjectId,
      ref: 'Employee',
      required: true,
    },
    actionAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeSalaryModel = mongoose.model('EmployeeSalary', EmployeeSalarySchema);
module.exports = EmployeeSalaryModel;
