const express = require("express");
const {
  CreateCategory,
  getallcategory,
  getonecategory,
  updatecategory,
  deleteCategory,
} = require("../controllers/Category.controller");
const router = express.Router();

router.route('/').post(CreateCategory).get(getallcategory);
router.route('/:categoryId').get(getonecategory).put(updatecategory).delete(deleteCategory);

module.exports = router;
