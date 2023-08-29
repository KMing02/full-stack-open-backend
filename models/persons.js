const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const validators = [
	{validator : function(v) {return(v.includes('-'))}, message: 'the number should contain -'},
	{validator : 
        function(v) {return((v.split('-')[0].length === 2) || (v.split('-')[0].length === 3))}, 
	message: 'the left part of - should consist of 2 or 3 numbers'},
	{validator:
        function(v) {return((!(isNaN(v.split('-')[1]))) && (!(v.split('-').length > 2)))},
	message: 'the right part should be a valid number'
	}
]

const entrySchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		minLength: 9,
		validate: validators
	}
})

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})


module.exports = mongoose.model('phone', entrySchema)