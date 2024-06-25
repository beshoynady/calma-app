const express = require("express");
const { addEmployeeTransaction,
    getallEmployeeTransaction,
    getoneEmployeeTransaction,
    editEmployeeTransaction,
    deleteEmployeeTransaction } = require('../controllers/EmployeeTransactions.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');
const authenticateToken = require('../utlits/authenticate.js')


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(authenticateToken, addEmployeeTransaction).get(authenticateToken, getallEmployeeTransaction);
router.route('/:employeetransactionsId').get(authenticateToken, getoneEmployeeTransaction).put(authenticateToken, editEmployeeTransaction).delete(authenticateToken, deleteEmployeeTransaction);
module.exports = router;
