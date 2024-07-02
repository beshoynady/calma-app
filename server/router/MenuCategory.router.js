const express = require("express");
const {
  createMenuCategory,
  getAllMenuCategories,
  getOneMenuCategory,
  updateMenuCategory,
  deleteMenuCategory
} = require("../controllers/MenuCategory.controller");
const authenticateToken = require('../utlits/authenticate')

const router = express.Router();

router.route('/').post(authenticateToken, createMenuCategory)
  .get(getAllMenuCategories);
router.route('/:menuCategoryId')
  .get(getOneMenuCategory)
  .put(authenticateToken, updateMenuCategory)
  .delete(authenticateToken, deleteMenuCategory);

module.exports = router;
