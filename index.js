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

app.get('/info', async (request, response) => {
	const count = await Phone.countDocuments()
	response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	Phone.findById(id).then(entry => {
		if (entry) {
			response.json(entry)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Phone.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

  
app.post('/api/persons', (request, response, next) => {
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
	person.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const entry = {
		name: body.name,
		number: body.number
	}

	Phone.findByIdAndUpdate(
		request.params.id, 
		entry, 
		{new: true, runValidators: true, context: 'query'})
		.then(updatedEntry => {
			response.json(updatedEntry)
		})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
