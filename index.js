const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const morgan = require('morgan')
morgan.token('body', function getBody(req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return '';
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const generateId = () => {
    let min = Math.ceil(10);
    let max = Math.floor(100);
    return Math.floor(Math.random() * (max - min)) + min;
}

const checkBody = (body) => {
    let errorText = null;
    if (!body.name) {
        errorText = 'Nimi puuttuu';
    }
    else if (!body.number) {
        errorText = 'Numero puuttuu';
    }
    else if (persons.map(person => person.name).includes(body.name)) {
        errorText = 'Nimi on jo luettelossa';
    }
    return errorText;
}

app.get('/info', (req, res) => {
    res.send('Phonebook has info for ' + persons.length + ' people.</br></br>' + new Date())
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    let errorText = checkBody(body)
    if (errorText) {
        return response.status(400).json({
            error: errorText
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


