const CustomerMessage = require('../models/Massage.model');

// Create a new customer message
const createCustomerMessage = async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body;
        const newMessage = await CustomerMessage.create({ name, email, phone, message });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
        next(error);
    }
};

// Get all customer messages
const getAllCustomerMessages = async (req, res, next) => {
    try {
        const messages = await CustomerMessage.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
        next(error);
    }
};

// Get a single customer message by ID
const getCustomerMessageById = async (req, res, next) => {
    try {
        const messageId = req.params.id;
        const message = await CustomerMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
        next(error);
    }
};

// Update a customer message by ID
const updateCustomerMessageById = async (req, res, next) => {
    try {
        const messageId = req.params.id;
        const updatedMessage = await CustomerMessage.findByIdAndUpdate(messageId, req.body, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
        next(error);
    }
};

// Delete a customer message by ID
const deleteCustomerMessageById = async (req, res, next) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await CustomerMessage.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(deletedMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
        next(error);
    }
};

module.exports = {
    createCustomerMessage,
    getAllCustomerMessages,
    getCustomerMessageById,
    updateCustomerMessageById,
    deleteCustomerMessageById
};
