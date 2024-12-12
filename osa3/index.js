const express = require('express');
const app = express();
app.use(express.json());
const morgan = require('morgan');
app.use(express.urlencoded({ extended: true }));

morgan.token('body', (req) => {
    if (req.method === 'POST' && req.body) {
      return JSON.stringify(req.body);
    }
    return '';
});
  
app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/', (req, res) => {
  res.send('Hello World');
});
let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2"
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4"
  },
  {
    name: "Maija Meikäläinen",
    number: "66666666",
    id: "39bd"
  }
];

app.get('/info', (request, response) => {
  const personCount = persons.length;

  response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Phonebook Info</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #333;
            color: #333;
            padding: 10px;
            background-color: #007bff;
            border-radius: 5px;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1>Phonebook Info</h1>
        <p>The phonebook has info for ${personCount} people.</p>
        <p>Current time: <span id="time"></span></p>
        <p>Request made: <span id="request-time"></span></p>
        <p>Page last updated: <span id="elapsed-time">0 seconds ago</span></p>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            const timeElement = document.getElementById('time');
            const requestTimeElement = document.getElementById('request-time');
            const elapsedTimeElement = document.getElementById('elapsed-time');

            const requestTime = new Date();
            requestTimeElement.textContent = requestTime.toLocaleTimeString();

            function updateTime() {
              const now = new Date();
              timeElement.textContent = now.toLocaleTimeString();
            }

            function updateElapsedTime() {
              const now = new Date();
              const secondsElapsed = Math.floor((now - requestTime) / 1000);
              elapsedTimeElement.textContent = \`\${secondsElapsed} seconds ago\`;
            }

            setInterval(updateTime, 1000);
            setInterval(updateElapsedTime, 1000);
            updateTime();
            updateElapsedTime();
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id); 

    if (person) {
        res.json(person);
    } else {
        res.status(404).send('No such person!!!');
    }
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id; 
    const initialLength = persons.length;
  
    persons = persons.filter(person => person.id !== id);
  
    if (persons.length < initialLength) {
      res.status(204).end(); 
    } else {
      res.status(404).json({ error: `Person with id ${id} not found` }); 
    }
  });

app.post('/api/persons', (req, res) => {
    const body = req.body; 

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }
  
    const newId = Math.floor(Math.random() * 1000000);
  
    const newPerson = {
      name: body.name,
      number: body.number,
      id: newId.toString()
    };
  
    persons.push(newPerson);
  
    res.status(201).json(newPerson);
  });
  

const PORT = 3002; // tähän 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
