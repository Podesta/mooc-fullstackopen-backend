const express = require('express');
const app = express();

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
