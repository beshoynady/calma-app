const EmployeeSalarymodel = require('../models/EmployeeSalary.model');

    
    const addSalaryMovement = async (req, res , next) => {
        try{
            const EmployeeId = await req.body.EmployeeId;
            const EmployeeName = await req.body.EmployeeName;
            const movement = await req.body.movement;
            const Amount = await req.body.Amount;
            const oldAmount = await req.body.oldAmount;
            const newAmount = await req.body.newAmount;
            const actionBy = await req.body.actionBy;
            const addEmployeeSalary= await EmployeeSalarymodel.create({EmployeeId,EmployeeName,movement,Amount,oldAmount,newAmount,actionBy});
            addEmployeeSalary.save();
            res.status(200).json(addEmployeeSalary)
        }
        catch (error) {
            res.status(400).json(error);
            next(error);
        }
    };
    
    const getallSalaryMovement = async (req, res) => {
        try{
            const allSalaryMovement = await EmployeeSalarymodel.find({})
            res.status(200).json(allSalaryMovement)
        }
        catch(error) {
            res.status(400).json(error);
        }
    }

    const getoneSalaryMovement = async (req, res) => {
        const salarymovementId = req.params.salarymovementId
        try{
            const EmployeeSalary = await EmployeeSalarymodel.findById(salarymovementId)
            res.status(200).json(EmployeeSalary)
        }catch(error){
            res.status(404).json(error);
        }
    }

    const editSalaryMovement = async (req, res)=>{
        try {
            const salarymovementId =await req.params.salarymovementId;
            const EmployeeId = await req.body.EmployeeId;
            const EmployeeName = await req.body.EmployeeName;
            const movement = await req.body.movement;
            const Amount = await req.body.Amount;
            const oldAmount = await req.body.oldAmount;
            const newAmount = await req.body.newAmount;
            const actionBy = await req.body.actionBy;
            const editMovement = await EmployeeSalarymodel.findByIdAndUpdate({_id:salarymovementId},{EmployeeId,EmployeeName,movement,Amount,oldAmount,newAmount,actionBy},{new : true})
            res.status(200).json(editMovement);
        }catch(error){
            res.status(404).json(error);
        }
    }

    const deleteSalaryMovement =async (req, res)=>{
        try{
            const salarymovementId = await req.params.salarymovementId;
            const SalaryMovementdeleted = await EmployeeSalarymodel.findByIdAndDelete(salarymovementId);
            res.status(200).json(SalaryMovementdeleted);
        }catch(error){
            res.status(404).json(error);
        }
    }


module.exports = {
    addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement
}