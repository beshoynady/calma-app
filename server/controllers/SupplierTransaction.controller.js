const SupplierTransaction = require('../models/SupplierTransaction.model');


// Create a new supplier transaction
const createSupplierTransaction = async (req, res) => {
    try {
        const {invoiceNumber, describtion, supplier, transactionDate, transactionType, amount, openingBalance, endingBalance, paymentMethod } = req.body;
        const newTransaction = await SupplierTransaction.create({invoiceNumber, describtion, supplier, transactionDate, transactionType, amount, openingBalance, endingBalance, paymentMethod});
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all supplier transactions
const getAllSupplierTransactions = async (req, res) => {
    try {
        const transactions = await SupplierTransaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single supplier transaction by ID
const getSupplierTransactionById = async (req, res) => {
    try {
        const transaction = await SupplierTransaction.findById(req.params.id).populate('supplier');
        if (!transaction) {
            return res.status(404).json({ message: 'Supplier transaction not found.' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a supplier transaction by ID
const updateSupplierTransaction = async (req, res) => {
    try {
        const { invoiceNumber, describtion, supplier, transactionDate, transactionType, amount, openingBalance, endingBalance, paymentMethod } = req.body;

        const updatedTransaction = await SupplierTransaction.findByIdAndUpdate(req.params.id, {invoiceNumber, describtion, supplier, transactionDate, transactionType, amount, openingBalance, endingBalance, paymentMethod}, { new: true });
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Supplier transaction not found.' });
        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a supplier transaction by ID
const deleteSupplierTransaction = async (req, res) => {
    try {
        const deletedTransaction = await SupplierTransaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Supplier transaction not found.' });
        }
        res.status(200).json({ message: 'Supplier transaction deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSupplierTransaction,
    getAllSupplierTransactions,
    getSupplierTransactionById,
    updateSupplierTransaction,
    deleteSupplierTransaction,
};
