const SupplierModel = require('../models/Supplier.model');

// Create a new supplier
const createSupplier = async (req, res) => {
    try {
        const { name, contact, address, paymentType, itemsSupplied, openingBalance, currentBalance, financialInfo,notes } = req.body;
        const createdBy = req.employee.id;
        const supplier = await SupplierModel.create({
            name,
            contact,
            address,
            paymentType,
            itemsSupplied,
            openingBalance,
            currentBalance,
            financialInfo,
            notes,
            createdBy
        });
        res.status(201).json(supplier);
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(400).json({ message: 'Failed to create supplier', error: error.message });
    }
}

// Retrieve all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await SupplierModel.find().populate('itemsSupplied createdBy');
        res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error getting all suppliers:', error);
        res.status(500).json({ message: 'Failed to get suppliers', error: error.message });
    }
}

// Retrieve a specific supplier by its ID
const getSupplierById = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const supplier = await SupplierModel.findById(supplierId).populate('itemsSupplied createdBy');
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        console.error('Error getting supplier by ID:', error);
        res.status(500).json({ message: 'Failed to get supplier', error: error.message });
    }
}

// Update a specific supplier by its ID
const updateSupplierById = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const { name, contact, address, paymentType, itemsSupplied, openingBalance, currentBalance, financialInfo, notes } = req.body;
        const updatedSupplier = await SupplierModel.findByIdAndUpdate(supplierId, {
            name,
            contact,
            address,
            paymentType,
            itemsSupplied,
            openingBalance,
            currentBalance,
            financialInfo,
            notes
        }, { new: true })
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier updated successfully', updatedSupplier });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(400).json({ message: 'Failed to update supplier', error: error.message });
    }
}

// Delete a specific supplier by its ID
const deleteSupplierById = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const deletedSupplier = await SupplierModel.findByIdAndDelete(supplierId);
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(400).json({ message: 'Failed to delete supplier', error: error.message });
    }
}

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplierById,
    deleteSupplierById
};
