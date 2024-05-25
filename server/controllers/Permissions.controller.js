const PermissionsModel = require('../models/Permissions.model');

const createPermission = async (req, res) => {
    try {
        const { employee, Permissions, createdBy } = req.body;

        if (!employee || !Permissions || Permissions.length === 0 || !createdBy) {
            return res.status(400).json({ message: 'حقول مطلوبة مفقودة.' });
        }

        const newPermission = await PermissionsModel.create({ employee, Permissions, createdBy });

        if (!newPermission) {
            return res.status(500).json({ message: 'فشل إنشاء الصلاحية.' });
        }

        res.status(201).json(newPermission);
    } catch (error) {
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
        const updatedPermission = await PermissionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
