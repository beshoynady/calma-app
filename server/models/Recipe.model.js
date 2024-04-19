const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema

const recipeSchema = new mongoose.Schema({
  product: {
    id: {
      type: ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    size:{
      type: String,
      // required: true,
    }
  },
  ingredients: [
    {
      itemId: {
        type: ObjectId,
        ref: 'StockItem',
        required: true,
      },
      name: {
        type: String,
        trim: true,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        trim: true,
        required: true,
      },
      costofitem: {
        type: Number,
        required: true,
      },
      totalcostofitem: {
        type: Number,
        required: true,
      },
    },
  ],
  totalcost: {
    type: Number,
    required: true,
    default: 0,
  },
},
{
  timestamps: true,
});

const RecipeModel = mongoose.model('Recipe', recipeSchema);

module.exports = RecipeModel;
