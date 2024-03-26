const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, 'Fullname is required'],
    minlength: 3,
    maxlength: 100,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  phone: {
    type: String,
    trim: true,
    length: 11,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    maxlength: 200,
    minlength: 3,
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurants',
    required: true  
  },
  numberID: {
    type: String,
    unique: true,
    required: [true, 'Number ID is required'],
    trim: true,
    minlength: 14,
    maxlength: 14,
  },
  address: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100,
    minlength: 10,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [true, 'isActive required'],
  },
  role: {
    type: String,
    trim: true,
    enum: ['owner', 'manager', 'casher', 'waiter', 'deliveryman', 'chef'],
    required: [true, 'Role is required'],
  },
  sectionNumber: {
    type: Number,
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
},
  {
    timestamps: true,
  }
);

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;
