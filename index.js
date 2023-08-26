const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Entry = require('./models/persons')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
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


const generateId = () => {
    const randId = Math.floor(Math.random() * 10000)
    return randId
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.number || !body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }  
  
    const person = {
      name: body.name,
      number: body.number || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
    response.json(person)
  })


const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
