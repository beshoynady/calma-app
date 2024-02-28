const RecipeModel = require('../models/Recipe.model');

const createRecipe = async (req, res) => {
  try {
    const { productid, productname, ingredients, totalcost } = req.body;
    if (!productid || !productname || !ingredients || !totalcost) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
    const newRecipe = await RecipeModel.create({
      product: {
        id: productid,
        name: productname
      },
      ingredients,
      totalcost
    },
    { new: true });
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredients, totalcost } = req.body;
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      { ingredients, totalcost },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllRecipe = async (req, res) => {
  try {
    const recipes = await RecipeModel.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await RecipeModel.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createRecipe, updateRecipe, getOneRecipe, getAllRecipe, deleteRecipe };
