const DailyExpenseModel = require('../models/DailyExpense.model');

// Get all daily expenses
exports.getAllDailyExpenses = async (req, res) => {
  try {
    const dailyExpenses = await DailyExpenseModel.find();
    res.status(200).json(dailyExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one daily expense by ID
exports.getDailyExpenseById = async (req, res) => {
  try {
    const dailyExpense = await DailyExpenseModel.findById(req.params.dailyExpenseId)
      .populate('expenseID', 'description amount') // Populate the 'expenseID' field with relevant data
      .populate('cashRegister', 'fieldName') // Replace 'fieldName' with the actual field name you want to populate
      .populate('paidBy', 'fieldName'); // Replace 'fieldName' with the actual field name you want to populate

    if (dailyExpense) {
      res.status(200).json(dailyExpense);
    } else {
      res.status(404).json({ message: 'Daily expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new daily expense
exports.addDailyExpense = async (req, res) => {
  const { expenseID, expenseDescription, cashRegister,cashMovementId, paidBy, amount, notes, date } = req.body;

  try {
    const newDailyExpense = await DailyExpenseModel.create({
      expenseID,
      expenseDescription,
      cashRegister,
      cashMovementId,
      paidBy,
      amount,
      notes,
      date
    });

    res.status(201).json(newDailyExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a daily expense by ID
exports.updateDailyExpense = async (req, res) => {
  const { expenseID, expenseDescription, cashRegister, paidBy, amount, notes, date } = req.body;

  try {
    const updatedDailyExpense = await DailyExpenseModel.findByIdAndUpdate(
      req.params.dailyExpenseId,
      {
        expenseID,
        expenseDescription,
        cashRegister,
        paidBy,
        amount,
        notes,
      },
      { new: true }
    );

    if (updatedDailyExpense) {
      res.status(200).json(updatedDailyExpense);
    } else {
      res.status(404).json({ message: 'Daily expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Delete a daily expense by ID
exports.deleteDailyExpense = async (req, res) => {
  try {
    const removedDailyExpense = await DailyExpenseModel.findByIdAndRemove(req.params.dailyExpenseId);
    if (removedDailyExpense) {
      res.status(200).json(removedDailyExpense);
    } else {
      res.status(404).json({ message: 'Daily expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
