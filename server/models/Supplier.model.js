const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// Supplier Schema
const SupplierSchema = new mongoose.Schema(
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
            social_media: {
                facebook: String,
                twitter: String,
                instagram: String,
                linkedin: String,
                youtube: String,
            }
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
                type: ObjectId,
                ref: 'StockItems',
            }
        ],
        // Previous balance of the supplier
        previousBalance: {
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
                }],
            // Additional notes about the supplier
            notes: {
                type: String,
                maxlength: 500,
            },
        },
    }, { timestamps: true }
);

const SupplierModel = mongoose.model('Supplier', SupplierSchema);

module.exports = SupplierModel;
