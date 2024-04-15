const mongoose = require('mongoose');

const supplierTransactionSchema = new mongoose.Schema({
    invoiceNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseInvoice',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    describtion: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['OpeningBalance', 'Purchase', 'Payment', 'PurchaseReturn', 'Refund'],
        required: true
    },
    previousBalance: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currentBalance: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    notes: String
}, { timestamps: true });

const SupplierTransaction = mongoose.model('SupplierTransaction', supplierTransactionSchema);

module.exports = SupplierTransaction;
