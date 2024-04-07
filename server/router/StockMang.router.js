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

// Middleware for token authentication
router.use(authenticateToken);

// Routes for stock actions
router.route('/')
    .post(createStockAction) // Create a new stock action
    .get(getAllStockActions); // Get all stock actions

router.route('/:actionid')
    .get(getOneStockAction) // Get a single stock action by ID
    .put(updateStockAction) // Update a stock action by ID
    .delete(deleteStockAction); // Delete a stock action by ID

module.exports = router;
