const mongoose = require('mongoose');
require('dotenv').config();
function connectToMongo() {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error("Db Error",err.message);
    process.exit(1);
  }
}

module.exports = connectToMongo;
