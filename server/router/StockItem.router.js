const express = require("express");

const {
    createStockItem,
    getAllStockItems,
    getOneItem,
    updateStockItem,
    movements,
    deleteItem,
  } = require('../controllers/StockItem.constroller')


const router = express.Router();

router.route('/').post(createStockItem).get(getAllStockItems);
router.route('/:itemId').get(getOneItem).delete(deleteItem).put(updateStockItem);
router.route('/movement/:itemId').put(movements)
module.exports = router;
