const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://admin:journeysyncthadomalproject@journeysync.3yvp2so.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI);
}
module.exports = connectToMongo;