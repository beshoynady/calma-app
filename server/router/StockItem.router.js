const express = require("express");

const {
  createStockItem,
  getAllStockItems,
  getOneItem,
  updateStockItem,
  movements,
  deleteItem,
} = require('../controllers/StockItem.constroller')
const authenticateToken = require('../utlits/authenticate')


const router = express.Router();

router.route('/').post(authenticateToken, createStockItem).get(authenticateToken, getAllStockItems);
router.route('/:itemId').get(authenticateToken, getOneItem)
  .delete(authenticateToken, deleteItem)
  .put(authenticateToken, updateStockItem);
router.route('/movement/:itemId').put(authenticateToken, movements)
module.exports = router;
