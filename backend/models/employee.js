const mongoose = require('mongoose');

// Define the schema for the Employee model
const employeeSchema = mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema, 'employees');