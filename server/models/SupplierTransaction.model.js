const { DESTRUCTION } = require('dns');
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
        enum: ['Purchase', 'Payment', 'PurchaseReturn'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    openingBalance: {
        type: Number,
        required: true
    },
    endingBalance: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    notes: String
},{timestamps: true , timeseries: true});

const SupplierTransaction = mongoose.model('SupplierTransaction', supplierTransactionSchema);

module.exports = SupplierTransaction;
