require ('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./models/person')
const config = require('./utils/config')
const mongoose = require('mongoose')

const app = express()

mongoose.set('strictQuery', false)

console.log('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

morgan.token('post-data',(req) => {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  return ' '
})
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(express.json())
app.use(express.static(path.join(__dirname,'dist')))


app.get('/api/persons',(request,response,next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id',(request, response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})




app.delete('/api/persons/:id',(request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(request, response,next) => {
  const body = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { number:body.number },
    { new:true,runValidators:true,context:'query' }
  )
    .then(updatedPerson => {
      if(updatedPerson){
        response.json(updatedPerson)
      }else{
        response.status(404).json({ error:'person not found' })
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons',(request, response,next) => { // POST 3.14
  const body = request.body

  const person = new Person({
    name:body.name,
    number:body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.get('/info',(request, response,next) => {
  Person.countDocuments({})
    .then(count => {
      const requestTime = new Date()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `)
    })
    .catch(error => next(error))
})

app.get(/\/(?!api)/, (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const errorHandler = (error,request,response,next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).json({ error:'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${config.PORT}`)
})