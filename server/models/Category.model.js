const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'يجب إدخال اسم التصنيف'],
        unique: [true, 'الاسم موجود بالفعل'],
        trim: true,
        maxlength: [30, 'يجب أن يكون الاسم أقل من 30 حرفًا'],
        minlength: [3, 'يجب أن يكون الاسم أكثر من 3 أحرف']
    },
    isMain: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, { timestamps: true }
);


const Categorymodel = mongoose.model('Category', categorySchema)

module.exports = Categorymodel