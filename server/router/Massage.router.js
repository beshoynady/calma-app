const express = require('express');
const router = express.Router();
const massageController = require('../controllers/Massage.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
    .post(authenticateToken, massageController.createCustomerMessage)
    .get(authenticateToken, massageController.getAllCustomerMessages);

router.route('/:id')
    .get(authenticateToken, massageController.getCustomerMessageById)
    .put(authenticateToken, massageController.updateCustomerMessageById)
    .delete(authenticateToken, massageController.deleteCustomerMessageById);

module.exports = router;
