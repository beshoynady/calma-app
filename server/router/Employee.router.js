const express = require("express");
const router = express.Router();
const { createEmployee, getoneEmployee, loginEmployee,updateOrAddPayrollForMonth,paidPayrollForMonth, getallEmployees, updateEmployee, deleteEmployee } = require('../controllers/Employee.controller.js');

router.route('/').post(createEmployee).get(getallEmployees);

router.route('/:employeeId').get(getoneEmployee).put(updateEmployee).delete(deleteEmployee);

router.route('/login').post(loginEmployee);

router.route('/payroll/:employeeId').put(updateOrAddPayrollForMonth);

router.route('/paid/:employeeId').put(paidPayrollForMonth);

module.exports = router;
