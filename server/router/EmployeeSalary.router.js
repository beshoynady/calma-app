const express = require("express");
const {
    addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement} = require('../controllers/EmployeeSalary.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');
const authenticateToken = require('../utlits/authenticate')


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(authenticateToken, addSalaryMovement).get(authenticateToken, getallSalaryMovement);
router.route('/:salarymovementId').get(authenticateToken, getoneSalaryMovement).put(authenticateToken, editSalaryMovement).delete(authenticateToken, deleteSalaryMovement);
module.exports = router;


// route.post("/create", createEmployee);
// route.get("/allEmployees", getAllemployees);
// route.get("/:Employeeid", getoneEmployee);
// route.put("/update/:Employeeid", updateEmployee);
// route.delete("/delete/:Employeeid", deleteEmployee);

// module.exports = route;
