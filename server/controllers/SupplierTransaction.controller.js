const SupplierTransactionModel = require('../models/SupplierTransaction.model');




// Create a new supplier transaction
const createSupplierTransaction = async (req, res) => {
    try {
        const { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes } = req.body;

        const recordedBy = req.employee.id;

        // Check the validity of the sent data
        if (!invoiceNumber || !supplier || !transactionDate || !transactionType || !amount || !previousBalance || !currentBalance || !paymentMethod) {
            return res.status(400).json({ message: 'Please provide all required data.' });
        }

        const newTransaction = await SupplierTransactionModel.create({ invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes, recordedBy });

        res.status(201).json(newTransaction);
    } catch (error) {
        // Provide a more specific error message
        res.status(500).json({ message: 'An error occurred while creating the transaction.', error: error.message });
    }
};



// Get all supplier transactions
const getAllSupplierTransactions = async (req, res) => {
    try {
        const transactions = await SupplierTransactionModel.find().populate('supplier').populate('recordedBy').populate('PurchaseInvoice');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single supplier transaction by ID
const getSupplierTransactionById = async (req, res) => {
    try {
        const transaction = await SupplierTransactionModel.findById(req.params.id).populate('supplier').populate('recordedBy').populate('PurchaseInvoice');
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
        const { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes } = req.body;
        const recordedBy = req.employee.id 

        const updatedTransaction = await SupplierTransactionModel.findByIdAndUpdate(req.params.id, {invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes, recordedBy}, { new: true });
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
        const deletedTransaction = await SupplierTransactionModel.findByIdAndDelete(req.params.id);
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
