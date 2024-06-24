const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
// Define the schema for an employee
const employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, 'Fullname is required'],
    minlength: 3, // Minimum length of the fullname
    maxlength: 100, // Maximum length of the fullname
  },
  username: {
    type: String,
    unique: true, // Username must be unique
    required: [true, 'Username is required'],
    trim: true,
    minlength: 3, // Minimum length of the username
    maxlength: 100, // Maximum length of the username
  },
  phone: {
    type: String,
    trim: true,
    length: 11, // Length of the phone number
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    maxlength: 200,
    minlength: 3,
  },
  shift: {
    type: ObjectId,
    ref: 'Shift',
    required: true,
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
    minlength: 3, // Minimum length of the address
    maxlength: 200, // Maximum length of the address
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100, // Maximum length of the email
    minlength: 10, // Minimum length of the email
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: true, // Default value for isAdmin is true
  },
  isActive: {
    type: Boolean,
    default: true, // Default value for isActive is true
    required: [true, 'isActive required'],
  },
  role: {
    type: String,
    trim: true,
    enum: ['owner', 'manager', 'cashier', 'waiter', 'deliveryman', 'chef'],
    required: [true, 'Role is required'],
  },
  sectionNumber: {
    type: Number,
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0, // Minimum value for basicSalary is 0
  },
  isVerified: {
    type: Boolean,
    default: false, // Default value for isVerified is false
  },
  createdBy:{
    type: ObjectId,
    ref:'Employee',
    required: true
  },
  updatedBy:{
    type: ObjectId,
    ref:'Employee',
    required: true
  }
},
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create a model based on the schema
const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel; 
