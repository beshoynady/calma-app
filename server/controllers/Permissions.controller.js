const mongoose = require('mongoose');

const PermissionsModel = require('../models/Permissions.model');

const createPermission = async (req, res) => {
    try {
        const { employee, Permissions } = req.body;
        const createdBy = req.employee.id;

        if (!mongoose.Types.ObjectId.isValid(employee) || !Permissions || Permissions.length === 0 || !mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).json({ message: 'Invalid or missing required fields.' });
        }

        const newPermission = await PermissionsModel.create({ employee, Permissions, createdBy });

        if (!newPermission) {
            return res.status(500).json({ message: 'Failed to create permission.', newPermission, employee, Permissions, createdBy });
        }

        res.status(201).json(newPermission);
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ message: error.message });
    }
};


const getAllPermissions = async (req, res) => {
    try {
        const permissions = await PermissionsModel.find().populate('employee');

        if (!permissions || permissions.length === 0) {
            return res.status(404).json({ message: 'لا توجد صلاحيات.' });
        }

        res.status(200).json(permissions);
    } catch (error) {
        console.error('Error in getAllPermissions:', error);
        res.status(500).json({ message: 'خطأ في الخادم الداخلي.' });
    }
};

const getPermissionById = async (req, res) => {
    try {
        const permission = await PermissionsModel.findById(req.params.id).populate('employee');

        if (!permission) {
            return res.status(404).json({ message: 'الصلاحية غير موجودة' });
        }

        res.status(200).json(permission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePermissionById = async (req, res) => {
    try {        
        const updatedBy = req.employee.id
        const { employee, Permissions } = req.body;

        const updatedPermission = await PermissionsModel.findByIdAndUpdate(req.params.id, { employee, Permissions, updatedBy }, { new: true });

        if (!updatedPermission) {
            return res.status(404).json({ message: 'الصلاحية غير موجودة' });
        }

        res.status(200).json(updatedPermission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePermissionById = async (req, res) => {
    try {
        const deletedPermission = await PermissionsModel.findByIdAndDelete(req.params.id);

        if (!deletedPermission) {
            return res.status(404).json({ message: 'الصلاحية غير موجودة' });
        }

        res.status(200).json({ message: 'تم حذف الصلاحية بنجاح' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermissionById,
    deletePermissionById
};
