const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const authenticateToken = require('../utlits/authenticate')

router.route('/')
    .post(authenticateToken, recipeController.createRecipe)
    .get(authenticateToken, recipeController.getAllRecipe);

router.route('/:id')
    .get(authenticateToken, recipeController.getOneRecipe)
    .put(authenticateToken, recipeController.updateRecipe)
    .delete(authenticateToken, recipeController.deleteRecipe);

module.exports = router;
