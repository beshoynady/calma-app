const express = require('express');
const router = express.Router();
const {
    createPurchaseReturnInvoice,
    getAllPurchaseReturnInvoices,
    getPurchaseReturnInvoiceById,
    updatePurchaseReturnInvoiceById,
    deletePurchaseReturnInvoiceById
} = require('../controllers/PurchaseReturn.controller');

const authenticateToken = require('../utlits/authenticate');

// Routes for purchase return management
router.route('/')
    .post(authenticateToken, createPurchaseReturnInvoice)
    .get(authenticateToken, getAllPurchaseReturnInvoices);

router.route('/:id')
    .get(authenticateToken, getPurchaseReturnInvoiceById)
    .put(authenticateToken, updatePurchaseReturnInvoiceById)
    .delete(authenticateToken, deletePurchaseReturnInvoiceById);

module.exports = router;
