const express = require('express');
const router = express.Router();
const messageController = require('../controllers/Message.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
    .post(authenticateToken, messageController.createCustomerMessage)
    .get(authenticateToken, messageController.getAllCustomerMessages);

router.route('/:id')
    .get(authenticateToken, messageController.getCustomerMessageById)
    .put(authenticateToken, messageController.updateCustomerMessageById)
    .delete(authenticateToken, messageController.deleteCustomerMessageById);

module.exports = router;
