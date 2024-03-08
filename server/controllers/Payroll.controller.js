const PayrollModel = require('../models/Payroll.model');

const createPayroll = async (req, res) => {
  const { employee, employeeName, Year, Month, salary, Bonus, TotalDue, AbsenceDays, AbsenceDeduction, OvertimeDays, OvertimeValue, Deduction, Predecessor, Insurance, Tax, TotalDeductible, NetSalary } = req.body;
  try {
    const payroll = PayrollModel.create({ employee, employeeName, Year, Month, salary, Bonus, TotalDue, AbsenceDays, AbsenceDeduction, OvertimeDays, OvertimeValue, Deduction, Predecessor, Insurance, Tax, TotalDeductible, NetSalary });
    await payroll.save();
    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getPayrollById = async (req, res) => {
  try {
    const id = req.params.id
    const payroll = await PayrollModel.findById(id);
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Payroll not found' });
    }
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const updatePayroll = async (req, res) => {
  const { salary, Bonus, TotalDue, AbsenceDays, AbsenceDeduction, OvertimeDays, OvertimeValue, Deduction, Predecessor, Insurance, Tax, TotalDeductible, NetSalary, isPaid, paidBy } = req.body;
  try {
    const payroll = await PayrollModel.findByIdAndUpdate(req.params.id, { salary, Bonus, TotalDue, AbsenceDays, AbsenceDeduction, OvertimeDays, OvertimeValue, Deduction, Predecessor, Insurance, Tax, TotalDeductible, NetSalary, isPaid, paidBy }, {
      new: true,
      runValidators: true,
    });
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Payroll not found' });
    }
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const updatePayrollByEmployee = async (req, res) => {
  const { employeeName, salary, Bonus, TotalDue, AbsenceDays, AbsenceDeduction, OvertimeDays, OvertimeValue, Deduction, Predecessor, Insurance, Tax, TotalDeductible, NetSalary } = req.body;

  const employeeId = req.params.employeeId;
  try {
    const payroll = await PayrollModel.findOneAndUpdate(employeeId, { employeeName, salary, Bonus, TotalDue, AbsenceDays, AbsenceDeduction, OvertimeDays, OvertimeValue, Deduction, Predecessor, Insurance, Tax, TotalDeductible, NetSalary, isPaid, paidBy }, {
      new: true,
      runValidators: true,
    });
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Payroll not found' });
    }
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const deletePayroll = async (req, res) => {
  try {
    const payroll = await PayrollModel.findByIdAndDelete(req.params.id);
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Payroll not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createPayroll,
  getPayrollById,
  updatePayroll,
  updatePayrollByEmployee,
  deletePayroll,
};
