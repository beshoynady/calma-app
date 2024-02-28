const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

router.route('/')
    .post(recipeController.createRecipe)
    .get(recipeController.getAllRecipe);

router.route('/:id')
    .get(recipeController.getOneRecipe)
    .put(recipeController.updateRecipe)
    .delete(recipeController.deleteRecipe);

module.exports = router;
