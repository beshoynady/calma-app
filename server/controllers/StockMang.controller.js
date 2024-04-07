const StockManagementModel = require('../models/StockManag.model');

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
            oldCost,
            cost,
            actionBy,
            actionAt,
            expirationDate,
        } = req.body;

        // Create a new stock action using the provided data
        const itemAdded = await StockManagementModel.create({
            itemId,
            unit,
            movement,
            quantity,
            oldBalance,
            balance,
            price,
            oldCost,
            cost,
            actionBy,
            actionAt,
            ...(movement === 'Purchase' && { expirationDate }),
        });

        // Respond with the created item
        res.status(201).json(itemAdded);
    } catch (error) {
        // Handle any errors that occur during the process
        next(error);
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
        const updatedAction = await StockManagementModel.findByIdAndUpdate(actionId, {
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
        next(error);
    }
};

const getAllStockActions = async (req, res, next) => {
    try {
        const allActions = await StockManagementModel.find({})
            .populate('itemId supplier actionBy');
        res.status(200).json(allActions);
    } catch (error) {
        next(error);
    }
};

const getOneStockAction = async (req, res, next) => {
    try {
        const actionId = req.params.actionid;
        const action = await StockManagementModel.findById(actionId)
            .populate('itemId supplier actionBy');

        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(action);
    } catch (error) {
        next(error);
    }
};

const deleteStockAction = async (req, res, next) => {
    try {
        const actionId = req.params.actionid;
        const deletedAction = await StockManagementModel.findByIdAndDelete(actionId);

        if (!deletedAction) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(deletedAction);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createStockAction,
    updateStockAction,
    getOneStockAction,
    getAllStockActions,
    deleteStockAction,
};