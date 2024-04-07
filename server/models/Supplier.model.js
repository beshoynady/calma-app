const mongoose = require('mongoose');

const { Schema } = mongoose;

// Supplier Schema
const SupplierSchema = new Schema(
    {
        // Supplier name
        name: {
            type: String,
            required: true,
        },
        // Supplier contact information
        contact: {
            phone: [
                {
                    type: String,
                    trim: true,
                    match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
                }
            ],
            whatsapp: {
                type: String,
                trim: true,
                match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
                match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
            },
        },
        // Supplier address
        address: {
            type: String,
        },
        // Supplier payment type
        paymentType: {
            type: String,
            enum: ['Cash', 'Credit'], // Add more options if needed
            required: true,
        },
        // Items supplied by the supplier
        itemsSupplied: [
            {
                type: Schema.Types.ObjectId,
                ref: 'StockItems',
            }
        ],
        // Opening balance of the supplier
        openingBalance: {
            type: Number,
            default: 0,
            required: true,
        },
        // Current balance of the supplier
        currentBalance: {
            type: Number,
            default: 0,
            required: true,
        },
        // Financial information
        financialInfo: {
            bankAccountNumber: {
                type: String,
                trim: true,
            },
            eWalletNumbers: [
                {
                    type: String,
                    trim: true,
                    maxlength: 500,
                }
            ],
            // Additional notes about the supplier
            notes: {
                type: String,
                maxlength: 500,
            },
        },
    },
    { timestamps: true }
);

// Define the Supplier model
const SupplierModel = mongoose.model('Supplier', SupplierSchema);

// Export the Supplier model
module.exports = SupplierModel;
