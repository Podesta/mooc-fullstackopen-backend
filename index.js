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

app.get('/info', (req, res, next) => {
  const date = new Date();
  Person.estimatedDocumentCount().then(entries => {
    res.send(
      `<p>Phonebook has info for ${entries} people</p>
     <p>${date}</p>`
    );
  })
    .catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons);
  })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id).then(person => {
    if (!person) {
      return res.status(404).send({ error: 'id not found' });
    }
    res.json(person);
  })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id).then(person => {
    console.log(`${id} removed`);
    res.status(204).end();
  })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;


  if (!body.name) {
    return res.status(400).json({
      error: 'Person must have a name field'
    });
  } else if (!body.phone) {
    return res.status(400).json({
      error: 'Person must have a phone field'
    });
  }

  const newPerson = new Person({
    name: body.name,
    phone: body.phone,
  });

  newPerson.save().then(savedPerson => {
    console.log(`${savedPerson.name} added to DB`);
    res.json(savedPerson);
  })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  
  const person = ({
    name: body.name,
    phone: body.phone,
  });

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then(returnedPerson => {
      if (!returnedPerson) {
        return res.status(404).send({ error: 'id not found' });
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
  
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
