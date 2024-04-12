const purchaseInvoiceModel = require('../models/Purchase.model');

// Create a new purchase invoice
const createPurchaseInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            date,
            supplier,
            items,
            totalAmount,
            discount,
            netAmount,
            salesTax,
            additionalCost,
            paidAmount,
            balanceDue,
            paymentDueDate,
            CashRegister,
            paymentStatus,
            invoiceType,
            paymentMethod,
            notes,
        } = req.body;

        // Assume that req.employee contains the authenticated employee information
        const createdBy = req.employee.id;

        const newPurchaseInvoice = await purchaseInvoiceModel.create({
            invoiceNumber,
            date,
            supplier,
            items,
            totalAmount,
            discount,
            netAmount,
            salesTax,
            additionalCost,
            paidAmount,
            balanceDue,
            paymentDueDate,
            CashRegister,
            paymentStatus,
            invoiceType,
            paymentMethod,
            notes,
            createdBy
        });

        // Populate the supplier, items, and createdBy fields
        const savedPurchaseInvoice = await newPurchaseInvoice.populate('supplier').populate('items.item').populate('createdBy').execPopulate();

        res.status(201).json(savedPurchaseInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve all purchase invoices
const getAllPurchaseInvoices = async (req, res) => {
    try {
        // Populate the supplier, items, and createdBy fields
        const purchaseInvoices = await purchaseInvoiceModel.find().populate('supplier').populate('items.item').populate('createdBy');
        res.status(200).json(purchaseInvoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single purchase invoice by ID
const getPurchaseInvoiceById = async (req, res) => {
    try {
        // Populate the supplier, items, and createdBy fields
        const purchaseInvoice = await purchaseInvoiceModel.findById(req.params.id).populate('supplier').populate('items.item').populate('createdBy');
        if (!purchaseInvoice) {
            return res.status(404).json({ message: 'Purchase invoice not found' });
        }
        res.status(200).json(purchaseInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a purchase invoice by ID
const updatePurchaseInvoiceById = async (req, res) => {
    try {
        const updatedPurchaseInvoice = await purchaseInvoiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPurchaseInvoice) {
            return res.status(404).json({ message: 'Purchase invoice not found' });
        }
        res.status(200).json(updatedPurchaseInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a purchase invoice by ID
const deletePurchaseInvoiceById = async (req, res) => {
    try {
        const deletedPurchaseInvoice = await purchaseInvoiceModel.findByIdAndDelete(req.params.id);
        if (!deletedPurchaseInvoice) {
            return res.status(404).json({ message: 'Purchase invoice not found' });
        }
        res.status(200).json({ message: 'Purchase invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPurchaseInvoice,
    getAllPurchaseInvoices,
    getPurchaseInvoiceById,
    updatePurchaseInvoiceById,
    deletePurchaseInvoiceById
};
