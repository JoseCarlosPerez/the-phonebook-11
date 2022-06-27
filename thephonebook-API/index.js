const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT;

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', (request) => {
    return request.body && Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons);
    }).catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
    const id = getId(request);

    Person.findById(id).then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).send();
        }
    }).catch(error => next(error));
});

app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        response.send(`<div>
            <div>Phonebook has info for ${persons.length} people</div>
            <div>${new Date()}</div>
        </div>`);
    }).catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (body && body.name && body.number) {
        getPersonByBody(body).save().then(res => {
            response.status(201).json(res);
        }).catch(error => next(error));
    } else {
        response.status(400).json({
            error: 'Wrong properties'
        });
    }
});

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;
    const id = getId(request);

    if (body && body.name && body.number) {
        const person = getPersonByBody(body);
        delete person._doc._id;

        Person.findByIdAndUpdate(id, person, { new: true, runValidators: true }).then(result => {
            response.status(200).json(result);
        }).catch(() => {
            response.status(404).json({
                error: 'Person does not exist'
            });
        });
    } else {
        response.status(400).json({
            error: 'Wrong properties'
        });
    }
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = getId(request);

    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end();
    }).catch(error => next(error));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function getId(request) {
    return request.params.id;
}

function getPersonByBody(body) {
    return new Person({
        'name': body.name,
        'number': body.number,
    });
}

function errorHandler(error, request, response, next) {
    let result = null;

    if (error.name === 'CastError') {
        result = response.status(400).send({ error: 'There is an error with the parameters' });
    } else if (error.name === 'ValidationError') {
        result = response.status(400).send({ error: error.message });
    } else {
        result = response.status(500).send({ error: `Error: ${error.message}` });
    }

    console.log(error.message);

    return result;
}

app.use(errorHandler);
