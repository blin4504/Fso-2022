const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


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

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    res.send(
        (`<div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date()}</div>`)
    );
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (!person) {
        res.status(404).send('Not Found');
    } else {
        res.json(person);
    }
});

const generateID = () => {
    return Math.floor(Math.random() * 10) + persons.length;
};

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({error: 'content missing'});
    }
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    };
    persons = persons.concat(person);
    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});