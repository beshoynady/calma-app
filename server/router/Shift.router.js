const express = require('express');
const router = express.Router();
const {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift
} = require('../controllers/Shift.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
  .post(authenticateToken, createShift)
  .get(authenticateToken, getAllShifts);

router.route('/:id')
  .get(authenticateToken, getShiftById)
  .put(authenticateToken, updateShift)
  .delete(authenticateToken, deleteShift);

module.exports = router;
