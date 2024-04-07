const express = require('express');
const {
    createStockAction,
    updateStockAction,
    getOneStockAction,
    getAllStockActions,
    deleteStockAction,
} = require('../controllers/StockMang.controller');

const authenticateToken = require('../utlits/authenticate');

const router = express.Router();

// Routes for stock actions
router.route('/')
    .post(authenticateToken, createStockAction) // Create a new stock action
    .get(authenticateToken, getAllStockActions); // Get all stock actions

router.route('/:actionid')
    .get(authenticateToken, getOneStockAction) // Get a single stock action by ID
    .put(authenticateToken, updateStockAction) // Update a stock action by ID
    .delete(authenticateToken, deleteStockAction); // Delete a stock action by ID

module.exports = router;
