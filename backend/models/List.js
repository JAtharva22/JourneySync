// List schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ListSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    src: {
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
    dest: {
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


ListSchema.index({ src: '2dsphere', dest: '2dsphere' });

module.exports = mongoose.model('list', ListSchema);
