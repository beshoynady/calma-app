const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/Payroll.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
    .post(authenticateToken, payrollController.createPayroll);

router.route('/:id')
    .get(authenticateToken, payrollController.getPayrollById)
    .put(authenticateToken, payrollController.updatePayroll)
    .delete(authenticateToken, payrollController.deletePayroll);

router.route('/employee/:employeeId').put(authenticateToken, payrollController.updatePayrollByEmployee)

module.exports = router;
