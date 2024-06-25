const EmployeeSalarymodel = require('../models/EmployeeSalary.model');


const addSalaryMovement = async (req, res, next) => {
    try {
        const { EmployeeId, EmployeeName, movement, Amount, oldAmount, newAmount } = req.body;

        if (!EmployeeId || !EmployeeName || !movement) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }

        if (isNaN(Amount) || isNaN(oldAmount) || isNaN(newAmount)) {
            return res.status(400).json({ error: "يجب أن تكون الحقول Amount و totalDays و oldAmount و newAmount أرقامًا صحيحة" });
        }

        const actionBy = req.employee.id;

        // إنشاء سجل حركة الراتب
        const addEmployeeSalary = await EmployeeSalarymodel.create({
            EmployeeId,
            EmployeeName,
            movement,
            totalDays,
            Amount,
            oldAmount,
            newAmount,
            actionBy
        });

        // حفظ السجل في قاعدة البيانات
        await addEmployeeSalary.save();

        // إرسال الاستجابة بنجاح
        res.status(200).json(addEmployeeSalary);
    } catch (error) {
        // إرسال استجابة الخطأ مع رسالة مفصلة
        res.status(500).json({ error: "حدث خطأ أثناء إضافة حركة الراتب", details: error.message });
        next(error);
    }
};


const getallSalaryMovement = async (req, res) => {
    try {
        const allSalaryMovement = await EmployeeSalarymodel.find({})
            .populate('EmployeeId', '_id fullname username')
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
            .populate('EmployeeId', '_id fullname username')
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
    const { EmployeeId, EmployeeName, movement, Amount, oldAmount, newAmount } = req.body;
    const updatedBy = req.employee.id
    try {
        // Validate required fields
        if (!EmployeeId || !EmployeeName || !movement || !updatedBy) {
            return res.status(400).json({ error: "All fields are required" });
        }


        const editMovement = await EmployeeSalarymodel.findByIdAndUpdate(
            { _id: salarymovementId },
            { EmployeeId, EmployeeName, movement, Amount, oldAmount, newAmount, actionBy },
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