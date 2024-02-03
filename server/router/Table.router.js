const express = require("express");

const {
  createTable,
  createQR,
  showAllTables,
  showOneTable,
  updateTable,
  deleteTable
} = require("../controllers/Table.controller");

const router = express.Router();

router.route('/').post(createTable).get(showAllTables);
router.route('/:tableid').get(showOneTable).delete(deleteTable).put(updateTable);
router.route('/qr').post(createQR)
module.exports = router;

