const mongoose= require('mongoose');

const categorySchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, 'required'],
        unique : [true, 'unique'],
        trim : true,
        maxlength : 30,
        minlength : 3,
    },
    createdAt:{
        type : Date,
        default : Date.now(),
        required : [true,'required']
    },
    updatedAt:{
        type : Date,
        default : Date.now(),
        required : [true,'required']
    }
},
{timestamps : true}
)


const Categorymodel = mongoose.model('Category', categorySchema)

module.exports = Categorymodel