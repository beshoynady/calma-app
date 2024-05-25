const mongoose = require('mongoose');

const { Schema } = mongoose;

const permissionsSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },
    permissions: [
      {
        resource: {
          type: String,
          enum: [
            'AttendanceRecord', 'CashMovement', 'CashRegister', 'Category', 'CategoryStock', 'DailyExpense',
            'DeliveryArea', 'Employee', 'EmployeeSalary', 'Expense', 'ExpenseRecords',
            'KitchenConsumption', 'Order', 'Payroll', 'Message', 'Permissions',
            'Product', 'Purchase', 'PurchaseReturn', 'Recipe', 'ReservationTable',
            'Restaurant', 'Shift', 'StockItem', 'StockManag', 'Supplier',
            'SupplierAccount', 'SupplierTransaction', 'Table', 'Users'
          ],
          required: true,
        },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
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
