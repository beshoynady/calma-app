const express = require("express");
const { addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement } = require('../controllers/EmployeeTransactions.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');
const authenticateToken = require('../utlits/authenticate.js')


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(authenticateToken, addSalaryMovement).get(authenticateToken, getallSalaryMovement);
router.route('/:salarymovementId').get(authenticateToken, getoneSalaryMovement).put(authenticateToken, editSalaryMovement).delete(authenticateToken, deleteSalaryMovement);
module.exports = router;
