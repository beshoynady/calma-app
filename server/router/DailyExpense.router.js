const express = require('express');
const router = express.Router();
const dailyExpensesController = require('../controllers/DailyExpense.controller');

// Get all daily expenses
router.route('/').post(dailyExpensesController.addDailyExpense).get(dailyExpensesController.getAllDailyExpenses);

// Get one daily expense by ID
router.route('/:dailyExpenseId').get(dailyExpensesController.getDailyExpenseById).put(dailyExpensesController.updateDailyExpense).delete(dailyExpensesController.deleteDailyExpense)


module.exports = router;
