// List schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

const RiderHistorySchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
    },
    fare:{
        type: Number,
        required: true
    },
    distanceTravelled:{
        type: Number,
    },
    timeOnMaps:{
        type: Number,
    },
    locationFrom: {
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
    locationTo: {
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
    date: {
        type: Date,
        default: Date.now,
    },
});

// Create indexes
RiderHistorySchema.index({ country: 1, state: 1, city: 1, vehicleType: 1 });
RiderHistorySchema.index({ location: '2dsphere' });

const DriverList = mongoose.model('DriverList', RiderHistorySchema);

module.exports = DriverList;
