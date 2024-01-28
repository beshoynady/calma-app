const express = require('express');
const router = express.Router();
const cashRegisterController = require('../controllers/CashRegister.controller');

// Routes related to Cash Register
router.route('/')
  .post(cashRegisterController.createCashRegister)
  .get(cashRegisterController.getAllCashRegisters);

router.route('/:id')
  .get(cashRegisterController.getCashRegisterById)
  .put(cashRegisterController.updateCashRegister)
  .delete(cashRegisterController.deleteCashRegister);

module.exports = router;

