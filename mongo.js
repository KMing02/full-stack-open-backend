const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://676906733:${password}@phonebook.sf0efqv.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).
catch(error => handleError(error));


const entrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Phone', entrySchema)

const entry = new Entry({
  name: name,
  number: number,
})

if (process.argv.length===3) {
    console.log('phonebook:')
    Entry.find({}).then(result => {
      result.forEach(e => {
          console.log(`${e.name} ${e.number}`)
      })
      mongoose.connection.close()
    })
  } else {
    entry.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
  }
// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })
  