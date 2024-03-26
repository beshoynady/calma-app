const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({

    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    shiftType: [
        {
            type: String,
            required: true,
        }
    ]
},
{
  timestamps: true,
});

module.exports = mongoose.model('Shift', shiftSchema);
