const express = require('express');
const router = express.Router();
const {
    createPermission,
    getAllPermissions,
    getPermissionById,
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

module.exports = router;
