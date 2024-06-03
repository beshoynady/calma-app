const express = require('express');
const router = express.Router();
const {
    createPermission,
    getAllPermissions,
    getPermissionById,
    getPermissionByEmployee,
    updatePermissionById,
    deletePermissionById
} = require('../controllers/Permissions.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
    .post(authenticateToken, createPermission)
    .get(authenticateToken, getAllPermissions);

router.route('/:id')
    .get(authenticateToken, getPermissionById)
    .put(authenticateToken, updatePermissionById)
    .delete(authenticateToken, deletePermissionById);

    router.route('/employee/:id').get(authenticateToken, getPermissionByEmployee);

module.exports = router;
