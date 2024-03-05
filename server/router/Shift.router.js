const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/Shift.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
  .post(authenticateToken, shiftController.createShift)
  .get(authenticateToken, shiftController.getAllShifts);

router.route('/:id')
  .get(authenticateToken, shiftController.getShiftById)
  .put(authenticateToken, shiftController.updateShiftById)
  .delete(authenticateToken, shiftController.deleteShiftById);

module.exports = router;
