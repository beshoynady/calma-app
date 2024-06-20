const express = require("express");
// const verifyJWT = require('../middleware/verifyjwt');
const router = express.Router();
const authenticateToken = require('../utlits/authenticate')

// router.use(verifyJWT)
const {
    createOrder,
    getOrder,
    getOrders,
    getLimitOrders,
    updateOrder,
    deleteOrder
} = require("../controllers/Order.controller");


router.route("/").post(createOrder).get(getOrders);
router.route("/:id").get(getOrder).put(updateOrder).delete(deleteOrder);
router.route("/limit/:limit").get(getLimitOrders)
module.exports = router;