const express = require("express");
const {
  CreateCategoryStock,
  getallcategoryStock,
  getonecategoryStock,
  updatecategoryStock,
  deleteCategoryStock,
} = require("../controllers/CategoryStock.controller");
const router = express.Router();

router.route('/').post(CreateCategoryStock).get(getallcategoryStock);
router.route('/:categoryStockId').get(getonecategoryStock).put(updatecategoryStock).delete(deleteCategoryStock);

module.exports = router;
