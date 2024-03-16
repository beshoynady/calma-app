const express = require("express");
const router = express.Router();
const { createEmployee, getoneEmployee, loginEmployee,
    //  updateOrAddPayrollForMonth, paidPayrollForMonth,
    getAllemployees, updateEmployee, deleteEmployee } = require('../controllers/Employee.controller.js');
const authenticateToken = require('../utlits/authenticate')

router.route('/').post(authenticateToken, createEmployee).get(authenticateToken, getAllemployees);

router.route('/:employeeId').get(getoneEmployee).put(authenticateToken, updateEmployee).delete(authenticateToken, deleteEmployee);

router.route('/login').post(loginEmployee);

// router.route('/payroll/:employeeId').put(authenticateToken, updateOrAddPayrollForMonth);

// router.route('/paid/:employeeId').put(authenticateToken, paidPayrollForMonth);

module.exports = router;
