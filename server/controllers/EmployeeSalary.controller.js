const EmployeeSalaryModel = require('../models/EmployeeSalary.model');

// Add a salary movement
const addSalaryMovement = async (req, res, next) => {
    try {
        const { EmployeeId, EmployeeName, movement, Amount, totalDays, oldAmount, newAmount, actionBy } = req.body;
        if (!EmployeeId || !EmployeeName || !movement || !Amount || !oldAmount || !newAmount || !actionBy) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const addEmployeeSalary = await EmployeeSalaryModel.create({ EmployeeId, EmployeeName, movement, Amount, totalDays, oldAmount, newAmount, actionBy });

        res.status(200).json(addEmployeeSalary);
    } catch (error) {
        res.status(400).json(error);
        next(error);
    }
};

// Get all salary movements
const getallSalaryMovement = async (req, res) => {
    try {
        const allSalaryMovement = await EmployeeSalaryModel.find({});
        res.status(200).json(allSalaryMovement);
    } catch (error) {
        res.status(400).json(error);
    }
};

// Get one salary movement
const getoneSalaryMovement = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    try {
        const EmployeeSalary = await EmployeeSalaryModel.findById(salarymovementId);
        if (!EmployeeSalary) {
            return res.status(404).json({ error: 'Salary movement not found' });
        }
        res.status(200).json(EmployeeSalary);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Edit a salary movement
const editSalaryMovement = async (req, res) => {
    try {
        const salarymovementId = req.params.salarymovementId;
        const { EmployeeId, EmployeeName, movement, Amount, totalDays, oldAmount, newAmount, actionBy } = req.body;
        
        if (!EmployeeId || !EmployeeName || !movement || !Amount || !oldAmount || !newAmount || !actionBy) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const editMovement = await EmployeeSalaryModel.findByIdAndUpdate(salarymovementId, { EmployeeId, EmployeeName, movement, Amount, totalDays, oldAmount, newAmount, actionBy }, { new: true });
        res.status(200).json(editMovement);
    } catch (error) {
        res.status(404).json(error);
    }
};

// Delete a salary movement
const deleteSalaryMovement = async (req, res) => {
    try {
        const salarymovementId = req.params.salarymovementId;
        const SalaryMovementdeleted = await EmployeeSalaryModel.findByIdAndDelete(salarymovementId);
        res.status(200).json(SalaryMovementdeleted);
    } catch (error) {
        res.status(404).json(error);
    }
};

module.exports = {
    addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement
};
