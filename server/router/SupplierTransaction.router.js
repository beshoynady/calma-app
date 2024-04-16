const express = require('express');
const router = express.Router();
const {
    createSupplierTransaction,
    getAllSupplierTransactions,
    getSupplierTransactionById,
    updateSupplierTransaction,
    deleteSupplierTransaction,
} = require('../controllers/SupplierTransaction.controller');

const authenticateToken = require('../utlits/authenticate');

router.route('/')
    .post(authenticateToken, createSupplierTransaction)
    .get(authenticateToken, getAllSupplierTransactions);

router.route('/:id')
    .get(authenticateToken, getSupplierTransactionById)
    .put(authenticateToken, updateSupplierTransaction)
    .delete(authenticateToken, deleteSupplierTransaction);

    
module.exports = router;
