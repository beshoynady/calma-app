const express = require('express');
const router = express.Router();
const cashMovementController = require('../controllers/CashMovement.controller');

// Routes related to Cash Movements
router.route('/')
  .get(cashMovementController.getAllCashMovements)
  .post(cashMovementController.createCashMovement);

router.route('/:id')
  .get(cashMovementController.getCashMovementById)
  .put(cashMovementController.updateCashMovement)
  .delete(cashMovementController.deleteCashMovement);

router.route('/transfer')
  .post(cashMovementController.transferCashBetweenRegisters);

module.exports = router;

