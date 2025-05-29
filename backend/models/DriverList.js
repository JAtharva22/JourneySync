// List schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DriverListSchema = new Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
    },
    vehicleType: {
        type: String,
        required: true,
    },
    isBusy: {
        type: Boolean,
        default: false,
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
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    lastLocationUpdateTime: {
        type: Date,
        default: Date.now,
    },
});

// Create indexes
DriverListSchema.index({ country: 1, state: 1, city: 1, vehicleType: 1 });
DriverListSchema.index({ location: '2dsphere' });

const DriverList = mongoose.model('DriverList', DriverListSchema);

module.exports = DriverList;
