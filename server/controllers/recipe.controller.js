const RecipeModel = require('../models/Recipe.model');

const createRecipe = async (req, res) => {
  try {
    const { productId, productName,size, ingredients, totalcost } = req.body;
    
    // Check if all required fields are present in the request body
    if (!productId || !productName || !ingredients || !totalcost) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if the value of ingredients is a non-empty array
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Ingredients value must be a non-empty array' });
    }
    
    // Check if each item's value in ingredients is valid
    for (const item of ingredients) {
      if (!item.itemId || !item.name || !item.amount || !item.unit || !item.costofitem || !item.totalcostofitem) {
        return res.status(400).json({ message: 'All ingredients fields are required' });
      }
    }
    
    // Create and save the recipe
    const newRecipe = await RecipeModel.create({
      productId,
      productName,
      size,
      ingredients,
      totalcost
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredients, totalcost, size } = req.body;
    
    // Check if recipe ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }
    
    // Check if ingredients and totalcost are provided
    if (!ingredients || !totalcost) {
      return res.status(400).json({ message: 'Ingredients and total cost are required' });
    }
    
    // Update the recipe by ID
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      { ingredients, totalcost, size },
      { new: true }
    );
    
    // If no recipe is found with the given ID, return 404 Not Found
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Return the updated recipe
    res.status(200).json(updatedRecipe);
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(400).json({ message: error.message });
  }
};


const getOneRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id).populate('productId');
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
    const recipes = await RecipeModel.find().populate('productId');
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
