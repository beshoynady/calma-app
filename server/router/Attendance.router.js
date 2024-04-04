const express = require('express');
const router = express.Router();
const {
    createAttendance,
    getAllAttendances,
    getAttendanceById,
    updateAttendanceById,
    deleteAttendanceById
  } = require('../controllers/Attendance.controller');
  
const authenticateToken = require('../utlits/authenticate')

router.route('/')
  .post(authenticateToken, createAttendance)
  .get(authenticateToken, getAllAttendances);

router.route('/:id')
  .get(authenticateToken, getAttendanceById)
  .put(authenticateToken, updateAttendanceById)
  .delete(authenticateToken, deleteAttendanceById);

module.exports = router;
