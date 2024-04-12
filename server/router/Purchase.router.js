const express = require('express');
const router = express.Router();
const {
    createPurchaseInvoice,
    getAllPurchaseInvoices,
    getPurchaseInvoiceById,
    updatePurchaseInvoiceById,
    deletePurchaseInvoiceById
} = require('../controllers/Purchase.controller');

const authenticateToken = require('../utils/authenticate');

// Routes for purchase management
router.route('/')
    .post(authenticateToken, createPurchaseInvoice)
    .get(authenticateToken, getAllPurchaseInvoices);

router.route('/:id')
    .get(authenticateToken, getPurchaseInvoiceById)
    .put(authenticateToken, updatePurchaseInvoiceById)
    .delete(authenticateToken, deletePurchaseInvoiceById);

module.exports = router;
