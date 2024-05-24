const mongoose = require('mongoose');
const { type } = require('os');

const { Schema } = mongoose;

const permissionsSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },
    Permissions:[
      {
        resource :{
          type: String,
          enum: [
            'AttendanceRecord', 'CashMovement', 'CashRegister', 'Category', 'CategoryStock', 'DailyExpense',
            'DeliveryArea', 'Employee', 'EmployeeSalary', 'Expense', 'ExpenseRecords', 
            'KitchenConsumption', 'Order', 'Payroll', 'Message', 'Permissions',
            'Product', 'Purchase', 'PurchaseReturn', 'Recipe', 'ReservationTable',
            'Restaurant', 'Shift', 'StockItem', 'StockManag', 'Supplier',
            'SupplierAccount', 'SupplierTransaction', 'Table', 'Users'
          ],
          required:true,
        },
        action:[{
          type: String,
          enum: ['create', 'update', 'read', 'delete'],
          required: true
        }],
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    }
  },
  { timestamps: true }
);

const PermissionsModel = mongoose.model('Permissions', permissionsSchema);

module.exports = PermissionsModel;
