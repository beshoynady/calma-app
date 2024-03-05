const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.jwt_secret_key; // Replace with your secret key

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' }); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, employee) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' }); // Forbidden
        }
        
        // Check if employee is admin and active
        if (!employee.isAdmin || !employee.isActive) {
            return res.status(403).json({ message: 'Forbidden: employee not authorized' }); // Forbidden
        }

        req.employee = employee;
        next();
    });
};

module.exports = authenticateToken;
