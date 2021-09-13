const mongoose = require('mongoose');

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Provide all arguments to command line');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fullstackopen01.bo6vs.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = mongoose.Schema({
  id: Number,
  name: String,
  phone: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const phonebook = new Person({
    name: process.argv[3],
    phone: process.argv[4],
  });

  phonebook.save().then(result => {
    console.log(`Added ${result.name} number ${result.phone} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.phone}`));
    mongoose.connection.close();
  });
}
