const AttendanceModel = require('../models/Attendance.model');


  // Create a new attendance record
  const createAttendance= async (req, res) => {
    try {
      const { employee, date, startTime, endTime, isOvertime, overtimeMinutes, lateMinutes, isLate, notes } = req.body;
      const attendance = await AttendanceModel.create({
        employee,
        date,
        startTime,
        endTime,
        isOvertime,
        overtimeMinutes,
        lateMinutes,
        isLate,
        notes
      });
      res.status(201).json(attendance);
    } catch (error) {
      console.error('Error creating attendance:', error);
      res.status(400).json({ message: 'Failed to create attendance', error: error.message });
    }
  }

  // Retrieve all attendance records
  const getAllAttendances= async (req, res) => {
    try {
      const attendances = await AttendanceModel.find().populate({
        path: 'employee',
        select: 'fullname role shift'
      });
      res.status(200).json(attendances);
    } catch (error) {
      console.error('Error getting all attendances:', error);
      res.status(500).json({ message: 'Failed to get attendances', error: error.message });
    }
  }

  // Retrieve a specific attendance record by its ID
  const getAttendanceById = async (req, res) => {
    try {
      const attendanceId = req.params.id;
      const attendance = await AttendanceModel.findById(attendanceId).populate({
        path: 'employee',
        select: 'fullname role shift'
      });;
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance not found' });
      }
      res.status(200).json(attendance);
    } catch (error) {
      console.error('Error getting attendance by ID:', error);
      res.status(500).json({ message: 'Failed to get attendance', error: error.message });
    }
  }

  // Update a specific attendance record by its ID
  const updateAttendanceById= async (req, res) => {
    try {
      const attendanceId = req.params.id;
      const { employee, date, startTime, endTime, isOvertime, overtimeMinutes, lateMinutes, isLate, notes } = req.body;
      const updatedAttendance = await AttendanceModel.findByIdAndUpdate(attendanceId, {
        employee,
        date,
        startTime,
        endTime,
        isOvertime,
        overtimeMinutes,
        lateMinutes,
        isLate,
        notes
      }, { new: true });
      if (!updatedAttendance) {
        return res.status(404).json({ message: 'Attendance not found' });
      }
      res.status(200).json({ message: 'Attendance updated successfully', updatedAttendance });
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(400).json({ message: 'Failed to update attendance', error: error.message });
    }
  }

  // Delete a specific attendance record by its ID
  const deleteAttendanceById = async (req, res) => {
    try {
      const attendanceId = req.params.id;
      const deletedAttendance = await AttendanceModel.findByIdAndDelete(attendanceId);
      if (!deletedAttendance) {
        return res.status(404).json({ message: 'Attendance not found' });
      }
      res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
      console.error('Error deleting attendance:', error);
      res.status(400).json({ message: 'Failed to delete attendance', error: error.message });
    }
  }

module.exports = {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById
};
