const mongoose = require('mongoose');


// Define the schema for the purchase invoice
const purchaseInvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true }, // Invoice number
    date: { type: Date, default: Date.now }, // Date of the invoice
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    }, // Reference to the supplier
    items: [{
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'StockItems',
          required: true,
        },
        quantity: { type: Number, required: true }, // Quantity of the item
        price: { type: Number, required: true }, // Price per unit of the item
        total: { type: Number, required: true }, // Total price for the item (quantity * price)
        expirationDate: { type: Date } // Expiration date of the item (if applicable)
      }], // Define for each item in the purchase invoice

    totalAmount: { type: Number, required: true }, // Total amount of the invoice
    discount: { type: Number, default: 0 }, // Discount applied to the invoice
    salesTax: { type: Number }, // Sales tax applied to the invoice
    additionalCost: { type: Number }, // Additional costs (if any)
    netAmount: { type: Number, required: true }, // Net amount after discount
    paidAmount: { type: Number, default: 0 }, // Amount already paid
    balanceDue: { type: Number, required: true, default: 0 }, // Remaining balance to be paid
    paymentDueDate: { type: Date, default: null }, // Due date for payment (in case of credit)
    CashRegister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CashRegister',
    }, // Reference to the cash register used for the transaction
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid'],
      default: 'unpaid'
    }, // Payment status of the invoice
    invoiceType: {
      type: String,
      enum: ['cash', 'credit'],
      default: 'cash'
    }, // Type of the invoice (cash or credit)
    paymentMethod: { type: String }, // Payment method used
    notes: { type: String }, // Additional notes or comments
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
  }
},{
    timestamps: true,
});
  purchaseInvoiceModel = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);
  module.exports = purchaseInvoiceModel