const StockManagModel = require('../models/StockManag.model');

const createStockAction = async (req, res, next) => {
    try {
        const {
            itemId,
            unit,
            movement,
            quantity,
            oldBalance,
            balance,
            price,
            cost,
            actionBy,
            actionAt,
            expirationDate,
        } = req.body;

        // Create a new stock action using the provided data
        const itemAdded = await StockManagModel.create({
            itemId,
            unit,
            movement,
            quantity,
            oldBalance,
            balance,
            price,
            cost,
            actionBy,
            actionAt,
            ...(movement === 'Purchase' && { expirationDate}),
 
        });

        // Respond with the created item
        res.status(201).json(itemAdded);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};

const updateStockAction = async (req, res, next) => {
    try {
        const {
            itemId,
            unit,
            movement,
            quantity,
            oldBalance,
            balance,
            price,
            cost,
            actionBy,
            expirationDate,
        } = req.body;

        const actionId = req.params.actionid;

        // Find and update the existing stock action by ID
        const updatedAction = await StockManagModel.findByIdAndUpdate(actionId, {
            itemId,
            unit,
            movement,
            quantity,
            oldBalance,
            balance,
            price,
            cost,
            actionBy,
            expirationDate,
        });

        if (!updatedAction) {
            // Handle the case where the action is not found
            return res.status(404).json({ message: 'Action not found' });
        }

        // Respond with the updated action
        res.status(200).json(updatedAction);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};

const getAllStockActions = async (req, res, next) => {
    try {
        const allActions = await StockManagModel.find({});
        res.status(200).json(allActions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneStockAction = async (req, res, next) => {
    try {
        const actionId = req.params.actionid;
        const action = await StockManagModel.findById(actionId);

        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(action);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStockAction = async (req, res, next) => {
    try {
        const actionId = req.params.actionid;
        const deletedAction = await StockManagModel.findByIdAndDelete(actionId);

        if (!deletedAction) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(deletedAction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStockAction,
    updateStockAction,
    getOneStockAction,
    getAllStockActions,
    deleteStockAction,
};
