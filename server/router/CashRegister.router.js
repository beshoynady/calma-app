const express = require('express');
const router = express.Router();
const cashRegisterController = require('../controllers/CashRegister.controller');

const authenticateToken = require('../utlits/authenticate')

// Routes related to Cash Register
router.route('/')
  .post(authenticateToken, cashRegisterController.createCashRegister)
  .get(authenticateToken, cashRegisterController.getAllCashRegisters);

router.route('/:id')
  .get(authenticateToken, cashRegisterController.getCashRegisterById)
  .put(authenticateToken , cashRegisterController.updateCashRegister)
  .delete(authenticateToken, cashRegisterController.deleteCashRegister);

module.exports = router;

