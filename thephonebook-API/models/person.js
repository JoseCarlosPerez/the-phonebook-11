const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.log('Error connecting to MongoDB', error.message);
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: (value) => {
                return value.length >= 3;
            }
        }
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return value.match(/\d+/g).join('').length >= 8;
            }
        }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
