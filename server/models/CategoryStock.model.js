const mongoose= require('mongoose');

const categoryStockSchema = new mongoose.Schema({
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


const CategoryStockmodel = mongoose.model('CategoryStock', categoryStockSchema)

module.exports = CategoryStockmodel