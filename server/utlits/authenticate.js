const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY; // Use a more descriptive name for your environment variable

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' }); // Unauthorized
    }
    
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' }); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, employee) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' }); // Forbidden
        }
        
        // Check if employee object exists and has required properties
        if (!employee || !employee.employeeinfo || typeof employee.employeeinfo.isAdmin !== 'boolean' || typeof employee.employeeinfo.isActive !== 'boolean') {
            return res.status(403).json({ message: 'Forbidden: Invalid employee information in token' }); // Forbidden
        }

        // Check if employee is admin and active
        if (!employee.employeeinfo.isAdmin || !employee.employeeinfo.isActive) {
            return res.status(403).json({ message: 'Forbidden: Employee not authorized' }); // Forbidden
        }

        req.employee = employee.employeeinfo;
        next();
    });
};

module.exports = authenticateToken;
