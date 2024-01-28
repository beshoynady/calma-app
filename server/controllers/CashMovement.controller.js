const CashMovement = require('../models/CashMovement.model');

// Controller function to create a cash movement
exports.createCashMovement = async (req, res) => {
  try {
    const { registerId, createBy, amount, type, description } = req.body;

    const newCashMovement = await CashMovement.create({
      registerId,
      createBy,
      amount,
      type,
      description,
    });

    await newCashMovement.save();
    res.status(201).json({ message: 'Cash movement created successfully', cashMovement: newCashMovement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cash movement', message: error.message });
  }
};

// Controller function to get all cash movements
exports.getAllCashMovements = async (req, res) => {
  try {
    const cashMovements = await CashMovement.find();
    res.status(200).json(cashMovements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cash movements', message: error.message });
  }
};

// Controller function to get a cash movement by ID
exports.getCashMovementById = async (req, res) => {
  try {
    const cashMovement = await CashMovement.findById(req.params.id);
    if (!cashMovement) {
      return res.status(404).json({ message: 'Cash movement not found' });
    }
    res.status(200).json(cashMovement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cash movement', message: error.message });
  }
};

// Controller function to update a cash movement by ID
exports.updateCashMovement = async (req, res) => {
  try {
    const { registerId, createBy, amount, type, description } = req.body;

    const cashMovement = await CashMovement.findById(req.params.id);
    if (!cashMovement) {
      return res.status(404).json({ message: 'Cash movement not found' });
    }

    cashMovement.registerId = registerId;
    cashMovement.createBy = createBy;
    cashMovement.amount = amount;
    cashMovement.type = type;
    cashMovement.description = description;

    await cashMovement.save();
    res.status(200).json({ message: 'Cash movement updated successfully', cashMovement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cash movement', message: error.message });
  }
};

// Controller function to delete a cash movement by ID
exports.deleteCashMovement = async (req, res) => {
  try {
    const cashMovement = await CashMovement.findByIdAndDelete(req.params.id);
    if (!cashMovement) {
      return res.status(404).json({ message: 'Cash movement not found' });
    }
    res.status(200).json({ message: 'Cash movement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cash movement', message: error.message });
  }
};

exports.transferCashBetweenRegisters = async (req, res) => {
  try {
    const { fromRegisterId, toRegisterId, amount, description } = req.body;

    // Check if both registers exist and handle errors if not found
    // Your logic here to validate register IDs

    // Create cash movements for both registers (one for outgoing, one for incoming)
    const outgoingMovement = new CashMovement({
      registerId: fromRegisterId,
      createBy: req.user._id, // Assuming user information is included in the request after authentication
      amount: -amount, // Negative amount for outgoing movement
      type: 'expense',
      description: description || 'Transfer to another register',
    });

    const incomingMovement = new CashMovement({
      registerId: toRegisterId,
      createBy: req.user._id,
      amount,
      type: 'income',
      description: description || 'Transfer from another register',
    });

    // Save both cash movements
    await outgoingMovement.save();
    await incomingMovement.save();

    res.status(200).json({ message: 'Cash transferred between registers successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
