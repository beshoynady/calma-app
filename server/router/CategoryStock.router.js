const express = require("express");
const {
  CreateCategoryStock,
  getallcategoryStock,
  getonecategoryStock,
  updatecategoryStock,
  deleteCategoryStock,
} = require("../controllers/CategoryStock.controller");

const authenticateToken = require('../utlits/authenticate')

const router = express.Router();

router.route('/').post(authenticateToken, CreateCategoryStock).get(authenticateToken, getallcategoryStock);
router.route('/:categoryStockId').get(authenticateToken, getonecategoryStock).put(authenticateToken, updatecategoryStock).delete(authenticateToken, deleteCategoryStock);

module.exports = router;
