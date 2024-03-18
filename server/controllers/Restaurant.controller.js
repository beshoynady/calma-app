const RestaurantModel = require('../models/Restaurant.model');


const createRestaurant = async (req, res) => {
    try {
        const { name, description, address, logo, contact, opening_hours } = req.body;

        if (!name || !description || !address  ) {
            return res.status(400).json({ message: 'all fields is required' });
        }

        const restaurant = await RestaurantModel.create({
            name,
            description,
            address, 
            logo,
            contact,
            opening_hours
        });

        await restaurant.save();

        return res.status(201).json(restaurant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantModel.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await RestaurantModel.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        return res.status(200).json(restaurant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, address, logo, contact, opening_hours } = req.body;

        const restaurant = await RestaurantModel.findByIdAndUpdate(id, {
            name,
            description,
            address, 
            logo,
            contact,
            opening_hours
        }, { new: true });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await RestaurantModel.findByIdAndDelete(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        return res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};
