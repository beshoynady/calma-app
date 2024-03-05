const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/Expense.controller');
const authenticateToken = require('../utlits/authenticate')


router.route("/").post(authenticateToken, expensesController.addExpense).get(authenticateToken, expensesController.getAllExpenses);
router.route("/:expenseId").get(authenticateToken, expensesController.getExpenseById).put(expensesController.updateExpense).delete(authenticateToken, expensesController.deleteExpense);



module.exports = router;
