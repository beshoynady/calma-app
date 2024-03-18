const express = require('express');
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/Restaurant.controller');

const authenticateToken = require('../utlits/authenticate')

router.route('/')
  .post(authenticateToken, createRestaurant)
  .get(authenticateToken, getAllRestaurants);

router.route('/:id')
  .get(authenticateToken, getRestaurantById)
  .put(authenticateToken, updateRestaurant)
  .delete(authenticateToken, deleteRestaurant);

module.exports = router;
