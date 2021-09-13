const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  phone: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
