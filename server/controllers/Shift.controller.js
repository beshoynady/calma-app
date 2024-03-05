const ShiftModel = require('../models/Shift.model');

module.exports = {
  // Create a new shift
  createShift: async (req, res) => {
    try {
      const { employeeId, date, startTime, endTime, shiftType, isOvertime, notes } = req.body;

      // Create a new shift
      const newShift = await ShiftModel.create({
        employeeId,
        date,
        startTime,
        endTime,
        shiftType,
        isOvertime,
        notes
      });

      res.status(201).json(newShift);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create shift', error: error.message });
    }
  },

  // Get all shifts
  getAllShifts: async (req, res) => {
    try {
      const shifts = await ShiftModel.find();
      res.status(200).json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get shifts', error: error.message });
    }
  },

  // Get a specific shift by ID
  getShiftById: async (req, res) => {
    try {
      const shiftId = req.params.id;
      const shift = await ShiftModel.findById(shiftId);
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
      res.status(200).json(shift);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get shift', error: error.message });
    }
  },

  // Update a specific shift by ID
  updateShiftById: async (req, res) => {
    try {
      const shiftId = req.params.id;
      const { employeeId, date, startTime, endTime, shiftType, isOvertime, notes } = req.body;

      // Check if the shift exists
      let shift = await ShiftModel.findById(shiftId);
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }

      // Update shift data
      shift.employeeId = employeeId;
      shift.date = date;
      shift.startTime = startTime;
      shift.endTime = endTime;
      shift.shiftType = shiftType;
      shift.isOvertime = isOvertime;
      shift.notes = notes;

      await shift.save();
      
      res.status(200).json({ message: 'Shift updated successfully', shift });
    } catch (error) {
      res.status(400).json({ message: 'Failed to update shift', error: error.message });
    }
  },

  // Delete a specific shift by ID
  deleteShiftById: async (req, res) => {
    try {
      const shiftId = req.params.id;

      // Delete the shift
      await ShiftModel.findByIdAndDelete(shiftId);

      res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete shift', error: error.message });
    }
  }
};
