const express = require('express');
const router = express.Router();
const {
  getAllKitchenConsumptions,
  getKitchenConsumptionById,
  createKitchenConsumption,
  updateKitchenConsumptionById,
  deleteKitchenConsumptionById
} = require('../controllers/kitchenConsumption.controller');

// Define routes using router.route for Kitchen Consumptions
router.route('/')
  .get(getAllKitchenConsumptions)
  .post(createKitchenConsumption);

router.route('/:id')
  .get(getKitchenConsumptionById)
  .put(updateKitchenConsumptionById)
  .delete(deleteKitchenConsumptionById);

module.exports = router;
