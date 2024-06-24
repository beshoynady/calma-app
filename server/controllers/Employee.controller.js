const EmployeeModel = require('../models/Employee.model.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Joi = require('joi');


const createEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100).required(),
    numberID: Joi.string().length(14).required(),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(3).max(150),
    phone: Joi.string().length(11).required(),
    password: Joi.string().min(3).required(),
    basicSalary: Joi.number().min(0).required(),
    sectionNumber: Joi.number().min(1),
    role: Joi.string().valid('owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef').required(),
    isActive: Joi.boolean().required(),
    shift: Joi.string().required()
});

const createEmployee = async (req, res) => {
    try {
        const createdBy = req.employee.id
        const { error } = createEmployeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Destructuring request body for required employee details
        const { fullname, numberID, username, shift, email, address, phone, basicSalary, role, sectionNumber, isActive } = req.body;

        // Destructuring request body for optional employee details
        const pass = req.body.password;
        const password = await bcrypt.hash(pass, 10);

        if (!fullname || !phone || !pass) {
            return res.status(400).json({ message: 'Invalid input: Fullname, Phone, or Password missing' });
        }

        const isEmployeeFound = await EmployeeModel.findOne({ phone });
        if (isEmployeeFound) {
            return res.status(409).json({ message: 'This phone is already in use' });
        }

        const newEmployee = await EmployeeModel.create({
            fullname,
            username,
            numberID,
            email,
            shift,
            phone,
            address,
            password,
            basicSalary,
            role,
            sectionNumber,
            isActive,
            createdBy
        }, { new: true });

        // Generating JWT token
        const accessToken = jwt.sign({
            employeeinfo: {
                id: newEmployee._id,
                username: newEmployee.username,
                isAdmin: newEmployee.isAdmin,
                isActive: newEmployee.isActive,
                role: newEmployee.role,
            }
        }, process.env.jwt_secret_key, { expiresIn: process.env.jwt_expire });

        res.status(201).json({ accessToken, newEmployee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateEmployeeSchema = Joi.object({
    fullname: Joi.string().min(3).max(100),
    numberID: Joi.string().length(14),
    username: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    address: Joi.string().min(3).max(150),
    phone: Joi.string().length(11),
    password: Joi.string().min(3),
    basicSalary: Joi.number().min(0),
    sectionNumber: Joi.number().min(1),
    role: Joi.string().valid('owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef'),
    isActive: Joi.boolean(),
    shift: Joi.string().required()
});



const updateEmployee = async (req, res) => {
    try {
        const updatedBy = req.employee.id
        const { error } = updateEmployeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const id = req.params.employeeId;
        const { fullname, numberID, username,shift, email, address, phone, basicSalary, role, sectionNumber, isActive, password } = req.body;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updateData = password ? { fullname, numberID, username, shift, email, address, phone, password: hashedPassword, basicSalary, isActive, role, sectionNumber } 
        : { fullname, numberID, username, email, shift, address, phone, basicSalary, isActive, role, sectionNumber, updatedBy};

        const updateEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json(updateEmployee);
    } catch (err) {
        res.status(400).json(err);
    }
};

const getoneEmployee = async (req, res) => {
    try {
        // Extract employee ID from request parameters
        const employeeId = req.params.employeeId;

        // Find the employee by ID and populate the 'shift' field
        const employee = await EmployeeModel.findById(employeeId).populate('shift').populate('createdBy').populate('updatedBy');

        // If employee not found, return a 404 error
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // If employee found, return it in the response
        res.status(200).json(employee);
    } catch (err) {
        // Handle errors occurred during the process
        console.error('Error fetching employee:', err);
        res.status(500).json({ message: 'An error occurred while fetching the employee' });
    }
}


const loginEmployee = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }

        const findEmployee = await EmployeeModel.findOne({ phone });

        if (!findEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const match = await bcrypt.compare(password, findEmployee.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            {
                employeeinfo: {
                    id: findEmployee._id,
                    username: findEmployee.username,
                    isAdmin: findEmployee.isAdmin,
                    isActive: findEmployee.isActive,
                    isVerified: findEmployee.isVerified,
                    role: findEmployee.role
                }
            },
            process.env.jwt_secret_key,
            { expiresIn: '1y' } // صلاحية التوكن لمدة سنة
        );

        if (!accessToken) {
            return res.status(500).json({ message: 'Failed to generate access token' });
        }

        res.status(200).json({ findEmployee, accessToken, message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllemployees = async (req, res) => {
    try {
        // Fetch all employees and populate the 'shift' field
        const allemployees = await EmployeeModel.find({}).populate('shift').populate('createdBy').populate('updatedBy');
        

        // If no employees found, return a 404 error
        if (!allemployees) {
            return res.status(404).json({ message: 'No employees found' });
        }

        // If employees found, return them in the response
        res.status(200).json(allemployees);
    } catch (err) {
        // Handle errors occurred during the process
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'An error occurred while fetching employees' , err});
    }
}



const deleteEmployee = async (req, res) => {
    try {
        const id = await req.params.employeeId;
        const employeedeleted = await EmployeeModel.findByIdAndDelete(id).exec();

    } catch (error) {
        res.status(500).json(error)

    }
}



// const validatePayroll = (data) => {
//     const schema = Joi.object({
//         month: Joi.number(),
//         salary: Joi.number().min(0),
//         additional: Joi.number().min(0),
//         bonus: Joi.number().min(0),
//         totalDue: Joi.number().min(0),
//         absence: Joi.number().min(0),
//         deduction: Joi.number().min(0),
//         predecessor: Joi.number().min(0),
//         insurance: Joi.number().min(0),
//         tax: Joi.number().min(0),
//         totalDeductible: Joi.number().min(0),
//         netSalary: Joi.number().min(0),
//         isPaid: Joi.boolean(),
//         paidBy: Joi.string()
//     });

//     return schema.validate(data);
// };

// const updateOrAddPayrollForMonth = async (req, res) => {
//     try {
//         // Validate incoming payroll data
//         const { error } = validatePayroll(req.body);
//         if (error) {
//             return res.status(400).json({ message: error.details[0].message });
//         }

//         // Extract data from the request body
//         const {
//             month,
//             salary,
//             additional,
//             bonus,
//             totalDue,
//             absence,
//             deduction,
//             predecessor,
//             insurance,
//             tax,
//             totalDeductible,
//             netSalary,
//             isPaid,
//             paidBy
//         } = req.body;

//         // Find the employee by ID
//         const employeeId = req.params.employeeId;
//         const employee = await EmployeeModel.findById(employeeId);

//         // Return an error if the employee is not found
//         if (!employee) {
//             return res.status(404).json({ message: 'Employee not found' });
//         }

//         // Check if payroll for the specified month exists
//         let found = false;
//         for (const payroll of employee.payRoll) {
//             if (payroll.Month === month) {
//                 found = true;
//                 if (!payroll.isPaid) {
//                     // Update payroll data if not paid

//                     payroll.salary = salary;
//                     payroll.Additional = additional;
//                     payroll.Bonus = bonus;
//                     payroll.TotalDue = totalDue;
//                     payroll.Absence = absence;
//                     payroll.Deduction = deduction;
//                     payroll.Predecessor = predecessor;
//                     payroll.Insurance = insurance;
//                     payroll.Tax = tax;
//                     payroll.TotalDeductible = totalDeductible;
//                     payroll.NetSalary = netSalary;
//                     payroll.isPaid = isPaid;
//                     payroll.paidBy = paidBy;
//                 }
//             }
//         };
//         // If payroll for the specified month doesn't exist, add a new entry
//         if (!found) {
//             employee.payRoll.push({
//                 Month: month,
//                 salary: salary,
//                 Additional: additional,
//                 Bonus: bonus,
//                 TotalDue: totalDue,
//                 Absence: absence,
//                 Deduction: deduction,
//                 Predecessor: predecessor,
//                 Insurance: insurance,
//                 Tax: tax,
//                 TotalDeductible: totalDeductible,
//                 NetSalary: netSalary,
//                 isPaid: isPaid,
//                 paidBy: paidBy,
//             });
//         }

//         // Save changes to the employee document
//         await employee.save();

//         // Return success message along with updated payroll information
//         res.status(200).json({ message: 'Payroll information updated for the month', payroll: employee.payRoll });
//     } catch (error) {
//         // Handle unexpected errors and return an error response
//         console.error(error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const paidPayrollForMonth = async (req, res) => {
//     const { employeeId } = req.params;
//     const { isPaid, paidBy, month } = req.body;

//     try {
//         const employee = await EmployeeModel.findById(employeeId);

//         if (!employee) {
//             return res.status(404).json({ message: 'Employee not found' });
//         }

//         const payrollItem = employee.payRoll.find(item => item.Month == month);

//         if (!payrollItem) {
//             return res.status(404).json({ message: 'Payroll item not found for this month' });
//         }

//         payrollItem.isPaid = isPaid || false;
//         payrollItem.paidBy = paidBy || null;

//         await employee.save();

//         return res.status(200).json({ message: 'Payroll updated successfully', employee });
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };



module.exports = { createEmployee, getoneEmployee, loginEmployee, 
    // updateOrAddPayrollForMonth, paidPayrollForMonth, 
    getAllemployees, updateEmployee, deleteEmployee };
