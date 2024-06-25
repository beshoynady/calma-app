const EmployeeSalarymodel = require('../models/EmployeeSalary.model');


const addSalaryMovement = async (req, res, next) => {
    try {
        const { employeeId, employeeName, movement, Amount, oldAmount, newAmount } = req.body;

        if (!employeeId || !employeeName || !movement) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const actionBy = req.employee.id;

        const addEmployeeSalary = await EmployeeSalarymodel.create({
            employeeId,
            employeeName,
            movement,
            Amount,
            oldAmount,
            newAmount,
            actionBy
        });

        await addEmployeeSalary.save();

        res.status(200).json(addEmployeeSalary);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding salary movements", details: error.message });
        next(error);
    }
};


const getallSalaryMovement = async (req, res) => {
    try {
        const allSalaryMovement = await EmployeeSalarymodel.find({})
            .populate('employeeId', '_id fullname username role shift')
            .populate('actionBy', '_id fullname username')
            .populate('updatedBy', '_id fullname username')
        res.status(200).json(allSalaryMovement);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching salary movements", details: error.message });
    }
};

const getoneSalaryMovement = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    try {
        const EmployeeSalary = await EmployeeSalarymodel.findById(salarymovementId)
            .populate('employeeId', '_id fullname username')
            .populate('actionBy', '_id fullname username')
            .populate('updatedBy', '_id fullname username')

        if (!EmployeeSalary) {
            return res.status(404).json({ error: "Salary movement not found" });
        }
        res.status(200).json(EmployeeSalary);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the salary movement", details: error.message });
    }
};

const editSalaryMovement = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    const { employeeId, employeeName, movement, Amount, oldAmount, newAmount } = req.body;
    const updatedBy = req.employee.id
    try {
        // Validate required fields
        if (!employeeId || !employeeName || !movement || !updatedBy) {
            return res.status(400).json({ error: "All fields are required" });
        }


        const editMovement = await EmployeeSalarymodel.findByIdAndUpdate(
            { _id: salarymovementId },
            { employeeId, employeeName, movement, Amount, oldAmount, newAmount, actionBy },
            { new: true }
        );

        if (!editMovement) {
            return res.status(404).json({ error: "Salary movement not found" });
        }

        res.status(200).json(editMovement);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while editing the salary movement", details: error.message });
    }
};

const deleteSalaryMovement = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    try {
        const SalaryMovementdeleted = await EmployeeSalarymodel.findByIdAndDelete(salarymovementId);
        if (!SalaryMovementdeleted) {
            return res.status(404).json({ error: "Salary movement not found" });
        }
        res.status(200).json(SalaryMovementdeleted);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the salary movement", details: error.message });
    }
};


module.exports = {
    addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement
}