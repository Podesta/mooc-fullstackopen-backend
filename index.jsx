const express = require('express');
const morgan = require('morgan');

const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', (req, res) => req.method == 'POST' ? JSON.stringify(req.body) : '');
app.use(express.json());
app.use(requestLogger);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
