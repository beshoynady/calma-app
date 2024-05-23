const RestaurantModel = require('../models/Restaurant.model');
const mongoose = require('mongoose');

// Create a new restaurant
const createRestaurant = async (req, res) => {
    try {
        const {
            name,
            description,
            logo,
            aboutText,
            address,
            locationUrl,
            dineIn,
            takeAway,
            deliveryService,
            contact,
            social_media,
            opening_hours,
            website,
            acceptedPayments,
            features,
            usesReservationSystem,

        } = req.body;

        // Validate required fields
        if (!name || !description || !address  || !website) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Create new restaurant instance
        const restaurant = new RestaurantModel({
            name,
            description,
            logo,
            aboutText,
            address,
            locationUrl,
            dineIn,
            takeAway,
            deliveryService,
            contact,
            social_media,
            opening_hours,
            website,
            acceptedPayments,
            features,
            usesReservationSystem,

        });

        // Save the restaurant to the database
        await restaurant.save();

        return res.status(201).json(restaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantModel.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get a single restaurant by ID
const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate restaurant ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }

        const restaurant = await RestaurantModel.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update a restaurant by ID
const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            logo,
            aboutText,
            address,
            locationUrl,
            dineIn,
            takeAway,
            deliveryService,
            contact,
            social_media,
            opening_hours,
            website,
            acceptedPayments,
            features,
            usesReservationSystem,
        } = req.body;

        // Validate restaurant ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }

        // Update restaurant details
        const restaurant = await RestaurantModel.findByIdAndUpdate(id, {
            name,
            description,
            logo,
            aboutText,
            address,
            locationUrl,
            dineIn,
            takeAway,
            deliveryService,
            contact,
            social_media,
            opening_hours,
            website,
            acceptedPayments,
            features,
            usesReservationSystem,

        }, { new: true, runValidators: true });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete a restaurant by ID
const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate restaurant ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }

        const restaurant = await RestaurantModel.findByIdAndDelete(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};
