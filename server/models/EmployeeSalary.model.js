const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const EmployeeSalarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: ObjectId,
      ref: 'Employee',
      required: true,
    },
    employeeName: {
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
    updatedBy: {
      type: ObjectId,
      ref: 'Employee',
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeSalaryModel = mongoose.model('EmployeeSalary', EmployeeSalarySchema);
module.exports = EmployeeSalaryModel;
