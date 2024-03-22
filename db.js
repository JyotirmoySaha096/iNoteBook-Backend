const mongoose = require("mongoose");
require('dotenv').config();

const mongoStr = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSCODE}@cluster0.yg8ia7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

connectToMongo().catch((err) => console.log(err));

async function connectToMongo() {
  try {
    await mongoose.connect(mongoStr);
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToMongo;

// const Kitten = mongoose.model('Kitten', kittySchema);

// const silence = new Kitten({ name: 'Silence' });
// console.log(silence.name);
