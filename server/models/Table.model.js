const mongoose = require('mongoose');

const { Schema } = mongoose;

// const ReservationSchema = new Schema(
//     {
//         tableNumber: {
//             type: Number,
//             required: true,
//         },
//         userId: {
//             type: Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         customerName: {
//             type: String,
//             required: true,
//         },
//         customerPhone: {
//             type: String,
//             required: true,
//         },
//         dateTime: {
//             type: Date,
//             required: true,
//         }
//     },
//     {
//         timestamps: true,
//     }
// );

const TableSchema = new Schema(
    {
        tablenum: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
            min: 1,
            max: 100000,
            validate: {
                validator: function (v) {
                    return v > 0;
                },
                message: '{VALUE} is not a valid table number'
            }
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        chairs: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
            default: 1,
            validate: {
                validator: function (v) {
                    return v > 0;
                },
                message: '{VALUE} is not a valid number of chairs'
            }
        },
        isValid: {
            type: Boolean,
            default: true,
            required: true
        },
        // reservations: [ReservationSchema],
        sectionNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

const TableModel = mongoose.model('Table', TableSchema);
module.exports = TableModel;
