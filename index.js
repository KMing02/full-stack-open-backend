require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Phone = require('./models/persons')

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
  Phone.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Phone.findById({id}).then(entry => {
      response.json(entry)
    })
  })

app.delete('/api/persons/:id', (request, response) => {
  Phone.findByIdAndRemove(request.params.id)
    .then(result => {
    response.status(204).end()
  })
})

  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.number || !body.name) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = new Phone({
      name: body.name,
      number: body.number,
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })


const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
