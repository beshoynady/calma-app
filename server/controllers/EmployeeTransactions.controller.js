const EmployeeTransactionsmodel = require('../models/EmployeeTransactions.model');


const addEmployeeTransaction = async (req, res, next) => {
    try {
        const { employeeId, employeeName, movement, Amount, oldAmount, newAmount } = req.body;

        if (!employeeId || !employeeName || !movement) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }
        const actionBy = req.employee.id;

        const addEmployeeTransactions = await EmployeeTransactionsmodel.create({
            employeeId,
            employeeName,
            movement,
            Amount,
            oldAmount,
            newAmount,
            actionBy
        });

        await addEmployeeTransactions.save();

        res.status(200).json(addEmployeeTransactions);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding salary movements", details: error.message });
        next(error);
    }
};


const getallEmployeeTransaction = async (req, res) => {
    try {
        const allEmployeeTransaction = await EmployeeTransactionsmodel.find({})
            .populate('employeeId', '_id fullname username role shift')
            .populate('actionBy', '_id fullname username')
            .populate('updatedBy', '_id fullname username')
        res.status(200).json(allEmployeeTransaction);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching salary movements", details: error.message });
    }
};

const getoneEmployeeTransaction = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    try {
        const EmployeeTransactions = await EmployeeTransactionsmodel.findById(salarymovementId)
            .populate('employeeId', '_id fullname username')
            .populate('actionBy', '_id fullname username')
            .populate('updatedBy', '_id fullname username')

        if (!EmployeeTransactions) {
            return res.status(404).json({ error: "Salary movement not found" });
        }
        res.status(200).json(EmployeeTransactions);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the salary movement", details: error.message });
    }
};

const editEmployeeTransaction = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    const { employeeId, employeeName, movement, Amount, oldAmount, newAmount } = req.body;
    const updatedBy = req.employee.id
    try {
        // Validate required fields
        if (!employeeId || !employeeName || !movement || !updatedBy) {
            return res.status(400).json({ error: "All fields are required" });
        }


        const editMovement = await EmployeeTransactionsmodel.findByIdAndUpdate(
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

const deleteEmployeeTransaction = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;
    try {
        const EmployeeTransactiondeleted = await EmployeeTransactionsmodel.findByIdAndDelete(salarymovementId);
        if (!EmployeeTransactiondeleted) {
            return res.status(404).json({ error: "Salary movement not found" });
        }
        res.status(200).json(EmployeeTransactiondeleted);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the salary movement", details: error.message });
    }
};


module.exports = {
    addEmployeeTransaction,
    getallEmployeeTransaction,
    getoneEmployeeTransaction,
    editEmployeeTransaction,
    deleteEmployeeTransaction
}