const express = require("express");
const {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/Category.controller");
const authenticateToken = require('../utlits/authenticate')

const router = express.Router();

router.route('/').post(authenticateToken, createCategory)
  .get(getAllCategories);
router.route('/:categoryId')
  .get(getOneCategory)
  .put(authenticateToken, updateCategory)
  .delete(authenticateToken, deleteCategory);

module.exports = router;
