const mongoose = require('mongoose')
const Person = require('./models/person')
const config = require('./utils/config')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}
const password = process.argv[2]

const url = config.MONGODB_URI.replace('<mipassword>', password) 

mongoose.set('strictQuery',false)
mongoose.connect(url)

if(process.argv.length === 3){  //mostrar todas las entradas
    console.log('phonebook')
    Person.find({}).then(result=>{
        result.forEach(person=>{
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

else if (process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person ({
        name: name,
        number: number,
    })

    person.save().then(result=>{
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

else {
    console.log('Invalid arguments')
    console.log('To add a person: node mongo.js <password> <name> <number>')
    console.log('To list all persons: node mongo.js <password>')
    mongoose.connection.close()
}