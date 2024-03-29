const express = require('express');
const router = express.Router();
const {
    createDeliveryArea,
    getAllDeliveryAreas,
    getDeliveryAreaById,
    updateDeliveryArea,
    deleteDeliveryArea
} = require('../controllers/DeliveryArea.controller');

const authenticateToken = require('../utlits/authenticate')


router.route("/").post(authenticateToken, createDeliveryArea)
    .get(getAllDeliveryAreas);

router.route("/:id").get(authenticateToken, getDeliveryAreaById)
    .put(authenticateToken, updateDeliveryArea)
    .delete(authenticateToken, deleteDeliveryArea);



module.exports = router;
