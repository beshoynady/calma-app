const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    description: {
        type: String,
        required: true,
        maxlength: 500 
    },
    address: {
        country: String,
        state: String,
        city: String,
        street: String,
        postal_code: String,
    },
    contact: {
        phone: [{
            type: String,
            match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
        }],
        whatsapp: {
            type: String,
            match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
        },
        email: {
            type: String,
            lowercase: true, 
            trim: true,
            unique: true, 
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], 
        },
        social_media: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String,
            youtube: String,
        }
    },
    opening_hours: {
        Saturday: {
            from: String,
            to: String
        },
        Sunday: {
            from: String,
            to: String
        },
        Monday: {
            from: String,
            to: String
        },
        Tuesday: {
            from: String,
            to: String
        },
        Wednesday: {
            from: String,
            to: String
        },
        Thursday: {
            from: String,
            to: String
        },
        Friday: {
            from: String,
            to: String
        }
    },
    delivery:  {
        type: Boolean,
        default: false
    }
});

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);

module.exports = RestaurantModel;
