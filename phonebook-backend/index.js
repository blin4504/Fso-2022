require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
   Person.find({}).then(people => {
    res.json(people);
   });
});

app.get('/info', (req, res) => {
    Person.find({}).count((err, count) => {
        if (err) console.log(err)
        else res.send(`there are ${count} numbers ${new Date()}`)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true})
    .then(updated => {
        res.json(updated)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(result => {
        if (result) {
            res.json(result);
        } else {
            res.status(404).end();
        }
    }).catch(err => next(err));
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({error: 'content missing'});
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end()
    }).catch(error => next(error))
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});
