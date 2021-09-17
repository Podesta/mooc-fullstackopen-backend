require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/phonebook');

const app = express();

/*
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}
*/

morgan.token('body', (req, res) => req.method == 'POST' ? JSON.stringify(req.body) : '');
app.use(express.static('build'));
app.use(express.json());
//app.use(requestLogger);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
  const date = new Date();
  const entries = persons.length;
  res.send(
    `<p>Phonebook has info for ${entries} people</p>
     <p>${date}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then(person => {
    res.json(person);
  })
    .catch((error) => {
      console.log(error.message);
      res.status(404).end();
  });
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id).then(person => {
    console.log(`${id} removed`);
    res.status(204).end();
  })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;


  if (!body.name) {
    return res.status(400).json({
      error: 'Person must have a name field'
    });
  } else if (!body.phone) {
    return res.status(400).json({
      error: 'Person must have a phone field'
    });
  } else if (Person.exists({ name: body.name })) {
    console.log('found');
    console.log(body.name);
  }

  const newPerson = new Person({
    name: body.name,
    phone: body.phone,
  });

  Person.exists({ name: body.name }).then(found => {
    if (found) {
      return res.status(400).json({
        error: 'Name must be unique'
      });
    } else if (!found) {
      newPerson.save().then(savedPerson => {
        console.log(`${savedPerson.name} added to DB`);
        res.json(savedPerson);
      });
    }
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  
  const person = ({
    name: body.name,
    phone: body.phone,
  });

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(returnedPerson => {
      if (!returnedPerson) {
        return res.status(404).send({ error: 'person with id not found' });
      }
      res.json(returnedPerson);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req , res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
