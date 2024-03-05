const express = require("express");
const authenticateToken = require('../utlits/authenticate')

const {
  createTable,
  createQR,
  showAllTables,
  showOneTable,
  updateTable,
  deleteTable
} = require("../controllers/Table.controller");

const router = express.Router();

router.route('/').post(authenticateToken,createTable).get(showAllTables);
router.route('/:tableid').get(showOneTable).delete(authenticateToken,deleteTable).put(authenticateToken, updateTable);
router.route('/qr').post(authenticateToken, createQR)
module.exports = router;

