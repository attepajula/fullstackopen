import { useState, useEffect } from 'react';
import './App.css';
import connection from './services/connection';

const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationClass = type === 'success' ? 'notification success' : 'notification error';

  return (
    <div className={notificationClass}>
      {message}
    </div>
  );
};

const PhonebookForm = ({ newName, setNewName, newNumber, setNewNumber, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
        <div>
          number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
          <button className="primary-button" type="submit">add</button>
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

const PersonList = ({ persons, searchTerm, handleDelete }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Numbers</h2>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button className="delete-button" onClick={() => handleDelete(person.id)}>Delete</button>
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
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    connection.getAll()
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted with:', newName, newNumber);
    addPerson({ name: newName, number: newNumber });
    setNewName('');
    setNewNumber('');
  };

  const addPerson = (newPerson) => {
    console.log('Adding person:', newPerson);
    const existingPerson = persons.find((person) => person.name === newPerson.name);

    if (existingPerson) {
      if (window.confirm(`${newPerson.name} is already in the phonebook. Replace the old number with a new one?`)) {
        connection.update(existingPerson.id, newPerson)
          .then((response) => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
            console.log('Person updated:', response.data);
            setNotificationType('success');
            setNotification(`Updated ${newPerson.name}`);
            setTimeout(() => setNotification(''), 5000);
          })
          .catch((error) => {
            console.error('Error updating person:', error);
            if (error.response && error.response.status === 404) {
              setNotificationType('error');
              setNotification(`Error: ${newPerson.name} was already deleted from the server.`);
            }
            setTimeout(() => setNotification(''), 5000);
          });
      }
    } else {
      connection.addPerson(newPerson)
        .then((response) => {
          console.log('New person added:', response.data);
          setPersons([...persons, response.data]);
          setNotificationType('success');
          setNotification(`Added ${newPerson.name}`);
          setTimeout(() => setNotification(''), 5000);
        })
        .catch((error) => {
          console.error('Error adding new person:', error);
          setNotificationType('error');
          setNotification('Error adding the person. Please try again.');
          setTimeout(() => setNotification(''), 5000);
        });
    }
  };

  const handleDelete = (personId) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      connection.remove(personId)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personId));
          console.log(`Person with ID ${personId} deleted`);
          setNotificationType('success');
          setNotification('Person deleted successfully.');
          setTimeout(() => setNotification(''), 5000);
        })
        .catch((error) => {
          console.error('Error deleting person:', error);
          setNotificationType('error');
          setNotification('Error deleting the person. Please try again.');
          setTimeout(() => setNotification(''), 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <PhonebookForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleSubmit={handleSubmit}
      />
      <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <PersonList persons={persons} searchTerm={searchTerm} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
