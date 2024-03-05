const express = require('express');
const {
    createStockAction,
    updateStockAction,
    getOneStockAction,
    getAllStockActions,
    deleteStockAction,
} = require('../controllers/StockMang.controller');

const authenticateToken = require('../utlits/authenticate')

const router = express.Router();

router.route('/').post(authenticateToken, createStockAction).get(authenticateToken, getAllStockActions)
router.route('/:actionid').get(authenticateToken,getOneStockAction).put(authenticateToken,updateStockAction).delete(deleteStockAction)

module.exports = router;
