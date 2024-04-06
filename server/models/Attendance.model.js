const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },
    shift: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    isOvertime: {
      type: Boolean,
      default: false,
    },
    overtimeMinutes: {
      type: Number,
      default: 0,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    }
  },
  { timestamps: true }
);

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = AttendanceModel;
