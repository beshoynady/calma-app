const express = require('express');
const {
    createStockAction,
    updateStockAction,
    getOneStockAction,
    getAllStockActions,
    deleteStockAction,
} = require('../controllers/StockMang.controller');

const router = express.Router();

router.route('/').post(createStockAction).get(getAllStockActions)
router.route('/:actionid').get(getOneStockAction).put(updateStockAction).delete(deleteStockAction)

module.exports = router;
