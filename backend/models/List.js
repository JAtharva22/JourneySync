const mongoose = require('mongoose');
const { Schema } = mongoose;

const ListSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    src:{
        type: Object,
        required: true
    },
    dest:{
        type: Object,
        required: true, 
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

  module.exports = mongoose.model('list', ListSchema);