const mongoose = require("mongoose");

const mongoStr = "mongodb://localhost:27017";

connectToMongo().catch(err => console.log(err));

async function connectToMongo() {
  await mongoose.connect(mongoStr);
}

module.exports = connectToMongo;

// const kittySchema = new mongoose.Schema({
//     name: String
// });

// const Kitten = mongoose.model('Kitten', kittySchema);

// const silence = new Kitten({ name: 'Silence' });
// console.log(silence.name);