const mongoose = require('mongoose');

// Define the schema for the EmployeeCafeAssignment model
const employeeCafeAssignmentSchema = new mongoose.Schema({
    employeeId: { 
        type: String, 
        ref: 'Employee' // Reference to the Employee model
    },
    cafeId: { 
        type: String, 
        ref: 'Cafe' // Reference to the Cafe model
    },
    startDate: { 
        type: Date // Type for the assignment start date
    }
});

// Create a unique index on employeeId to ensure no duplicate assignments per employee
employeeCafeAssignmentSchema.index({ employeeId: 1 }, { unique: true });

// Export the EmployeeCafeAssignment model based on the schema
module.exports = mongoose.model('EmployeeCafeAssignment', employeeCafeAssignmentSchema);
