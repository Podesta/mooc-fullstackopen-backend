const express = require('express');
const app = express();

app.use(express.json());

app.get('/info', (request, response) => {
  const date = new Date();
  const entries = persons.length;
  response.send(
    `<p>Phonebook has info for ${entries} people</p>
     <p>${date}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 10000000 + 1);
app.post('/api/persons', (request, response) => {
  const person = request.body;
  person.id = generateId();

  if (!person.name) {
    return response.status(400).json({
      error: 'Person must have a name field'
    });
  } else if (!person.number) {
    return response.status(400).json({
      error: 'Number must have a name field'
    });
  } else if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    });
  }

  persons = persons.concat(person);

  response.json(person);
});

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
