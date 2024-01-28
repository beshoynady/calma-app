const CashRegister = require('../models/CashRegister.model');

// Get all cash registers
const getAllCashRegisters = async (req, res) => {
  try {
    const cashRegisters = await CashRegister.find();
    res.status(200).json(cashRegisters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single cash register by ID
const getCashRegisterById = async (req, res) => {
  try {
    const cashRegister = await CashRegister.findById(req.params.id);
    if (!cashRegister) {
      return res.status(404).json({ message: 'Cash register not found' });
    }
    res.status(200).json(cashRegister);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a cash register
const createCashRegister = async (req, res) => {
  const { name, employee } = req.body;
  const cashRegister = new CashRegister({
    name,
    employee,
  });

  try {
    const newCashRegister = await cashRegister.save();
    res.status(201).json(newCashRegister);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a cash register
const updateCashRegister = async (req, res) => {
  try {
    const updateFields = {}; // Updated values will be stored here

    // Check the sent values and update them if they are sent in req.body
    if (req.body.name) {
      updateFields.name = req.body.name;
    }
    if (req.body.balance) {
      updateFields.balance = req.body.balance;
    }
    if (req.body.employee) {
      updateFields.employee = req.body.employee;
    }

    const cashRegister = await CashRegister.findById(req.params.id);

    if (!cashRegister) {
      return res.status(404).json({ message: 'Cash register not found' });
    }

    // Update the values in the cash register using only the updated fields
    Object.assign(cashRegister, updateFields);

    const updatedCashRegister = await cashRegister.save();
    res.status(200).json(updatedCashRegister);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete a cash register
const deleteCashRegister = async (req, res) => {
  try {
    const cashRegister = await CashRegister.findById(req.params.id);
    if (!cashRegister) {
      return res.status(404).json({ message: 'Cash register not found' });
    }
    await cashRegister.remove();
    res.status(200).json({ message: 'Cash register deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCashRegisters,
  getCashRegisterById,
  createCashRegister,
  updateCashRegister,
  deleteCashRegister,
};
