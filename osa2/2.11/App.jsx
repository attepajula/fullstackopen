import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

const App = () => {
  const [persons, setPersons] = useState([])

  const handleClick = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  const handleButtonClick = () => {
    handleClick()
  }

  return (
    <div>
    <div>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.name} - {person.number}
          </li>
        ))}
      </ul>
    </div>
      <button onClick={handleButtonClick}>Fetch Persons</button>
    </div>
  )
}

export default App