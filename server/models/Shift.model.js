const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    shiftType: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Shift', shiftSchema);
