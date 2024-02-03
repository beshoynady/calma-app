const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/Expense.controller');


router.route("/").post(expensesController.addExpense).get(expensesController.getAllExpenses);
router.route("/:expenseId").get( expensesController.getExpenseById).put(expensesController.updateExpense).delete(expensesController.deleteExpense);



module.exports = router;
