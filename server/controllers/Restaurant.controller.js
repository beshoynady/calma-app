const RestaurantModel = require('../models/Restaurant.model');


const createRestaurant = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        if (!name || !description || !address) {
            return res.status(400).json({ message: 'all fields is required' });
        }
        // const image = req.file.filename;
        // if (!image) {
        //     return res.status(400).json({ message: 'image is required' });
        // }


        const restaurant = await RestaurantModel.create({
            name,
            description,
            address,
            // logo:image
        });

        if (!restaurant) {
            return res.status(500).json({ message: 'Failed to create restaurant' , restaurant});
        }

        return res.status(201).json(restaurant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' , error});
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
        const { name, description, address, contact, opening_hours , shifts, delivery_area} = req.body;
        const image = req.file.filename;

        const restaurant = await RestaurantModel.findByIdAndUpdate(id, {
            name,
            description,
            address,
            logo: image,
            contact,
            opening_hours,
            shifts,
            delivery_area
        }, { new: true });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error });
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