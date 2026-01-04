const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const mongoUrl = `mongodb+srv://bloguser:${encodeURIComponent(password)}@bloglist-cluster.q3fcx.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {

  Person.find({}).then((result) => {
    console.log('PHONEBOOK:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
