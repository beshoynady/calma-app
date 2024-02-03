const express = require("express");
const {addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement} = require('../controllers/EmployeeSalary.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(addSalaryMovement).get(getallSalaryMovement);
router.route('/:salarymovementId').get(getoneSalaryMovement).put(editSalaryMovement).delete(deleteSalaryMovement);
module.exports = router;


// route.post("/create", createEmployee);
// route.get("/allEmployees", getallEmployees);
// route.get("/:Employeeid", getoneEmployee);
// route.put("/update/:Employeeid", updateEmployee);
// route.delete("/delete/:Employeeid", deleteEmployee);

// module.exports = route;
