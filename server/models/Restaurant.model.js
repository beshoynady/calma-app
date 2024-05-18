const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    logo: {
        type: String,
        // required: true,
        trim: true
    },
    address: {
        country: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        street: {
            type: String,
            required: true,
            trim: true,
        },
        postal_code: {
            type: String,
            trim: true,
        },
    },
    contact: {
        phone: [
            {
                type: String,
                trim: true,
                match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
            }],
        whatsapp: {
            type: String,
            trim: true,
            match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
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
            to: String,
            closed: Boolean
        },
        Sunday: {
            from: String,
            to: String,
            closed: Boolean
        },
        Monday: {
            from: String,
            to: String,
            closed: Boolean
        },
        Tuesday: {
            from: String,
            to: String,
            closed: Boolean
        },
        Wednesday: {
            from: String,
            to: String,
            closed: Boolean
        },
        Thursday: {
            from: String,
            to: String,
            closed: Boolean
        },
        Friday: {
            from: String,
            to: String,
            closed: Boolean
        }
    },
    website: {
        type: String,
        trim: true,
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL']
    },
    acceptedPayments: {
        type: [String],
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Vodafone Cash', 'Etisalat Cash', 'Aman', 'PayPal', 'Other'],
        default: 'Cash'
    },
    amenities: {
        type: [String],
        enum: ['WiFi', 'Parking', 'Outdoor Seating', 'Wheelchair Accessible', 'Live Music', 'Pet Friendly', 'Kids Friendly', 'Other']
    },
    usesReservationSystem: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true }
);

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);

module.exports = RestaurantModel;

