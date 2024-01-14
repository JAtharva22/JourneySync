const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    vehicleName: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    vehicleNoPlate: {
        type: String,
        required: true,
    },
    vehicleColor: {
        type: String,
        required: true,
    },
    license: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    // luggage: {
    //     type: Boolean,
    //     default: true, 
    // },
    // isBusy: {
    //     type: Boolean,
    //     default: false, 
    // },
    // location: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true,
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true,
    //     },
    // },
    // lastLocationUpdateTime: {
    //     type: Date,
    //     default: Date.now,
    // },
});

// driverSchema.index({ country: 1, state: 1, city: 1 });
// Create a geospatial index
driverSchema.index({ location: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
