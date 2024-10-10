import { useState, useEffect } from 'react'; // Muista lisätä useEffect
import axios from 'axios';
import './App.css';

const PhonebookForm = ({ newName, setNewName, newNumber, setNewNumber, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
        <div>
          number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
          <button type="submit">add</button>
        </div>
      </div>
    </form>
  );
};

const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      Search: <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
    </div>
  );
};

const PersonList = ({ persons, searchTerm }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Numbers</h2>
      {filteredPersons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    addPerson({ name: newName, number: newNumber });
    setNewName('');
    setNewNumber('');
    console.log('New name and number posted:', newName, newNumber);
  };

  const addPerson = (newPerson) => {
    const personExists = persons.some((person) => person.name === newPerson.name);
    if (personExists) {
      alert(`${newPerson.name} is already in the phonebook!`);
    } else {
      setPersons([...persons, newPerson]);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <PhonebookForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleSubmit={handleSubmit}
      />
      <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <PersonList persons={persons} searchTerm={searchTerm} />
    </div>
  );
};

export default App;
