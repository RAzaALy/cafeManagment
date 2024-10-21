// controllers/employeeController.js

const Employee = require('../models/employee');
const EmployeeCafeAssignment = require('../models/employeeCafeAssignment');
const mongoose = require('mongoose');

// Function to generate a unique employee ID
function generateEmployeeId() {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters for ID
    let id = 'UI'; // Prefix for employee ID
    for (let i = 0; i < 7; i++) { // Generate 7 random characters
        id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    return id; // Return the generated ID
}

// Get all employees, optionally filtered by cafeId
const getAllEmployees = async (req, res) => {
    const cafeName = req.query.cafeName; // Extract cafeName from query parameters
    try {
        const employees = await Employee.aggregate([
            {
                $lookup: { // Join with employeeCafeAssignments
                    from: "employeecafeassignments",
                    let: { employeeId: "$employeeId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$employeeId", "$$employeeId"] } } }
                    ],
                    as: "assignments"
                }
            },
            { $unwind: { path: "$assignments", preserveNullAndEmptyArrays: true } }, // Flatten assignments array
            {
                $lookup: { // Join with cafes to get cafe details
                    from: "cafes",
                    localField: "assignments.cafeId",
                    foreignField: "cafeId",
                    as: "cafeDetails"
                }
            },
            { $unwind: { path: "$cafeDetails", preserveNullAndEmptyArrays: true } }, // Flatten cafe details
            // Conditional matching based on cafeName if provided, using a regex for partial matching
            ...(cafeName ? [{ $match: { "cafeDetails.name": { $regex: cafeName, $options: "i" } } }] : []),
            {
                $project: { // Specify fields to include in the output
                    _id: 0,
                    employeeId: 1,
                    name: 1,
                    email: "$email_address",
                    phone: "$phone_number",
                    gender: 1,
                    cafeDetails: 1,
                    daysWorked: { // Calculate days worked
                        $cond: {
                            if: { $gt: ["$assignments.startDate", null] },
                            then: {
                                $floor: {
                                    $divide: [
                                        { $subtract: [new Date(), "$assignments.startDate"] },
                                        1000 * 60 * 60 * 24 // Convert milliseconds to days
                                    ]
                                }
                            },
                            else: null
                        }
                    }
                }
            },
            { $sort: { daysWorked: -1 } } // Sort employees by days worked in descending order
        ]);

        res.json(employees); // Send employees data in the response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};


// Create a new employee
const createEmployee = async (req, res) => {
    const { email: email_address, phone: phone_number, name, gender, cafeId } = req.body; // Destructure request body
    const session = await mongoose.startSession(); // Start a session for transactions
    session.startTransaction();
    try {
        const generatedEmployeeId = generateEmployeeId(); // Generate unique employee ID
        const employee = new Employee({ employeeId: generatedEmployeeId, name, email_address, phone_number, gender });
        await employee.save({ session }); // Save the employee

        if (cafeId) { // If cafeId is provided, create an assignment
            const startDate = new Date().getTime(); // Get the current date
            const assignment = new EmployeeCafeAssignment({ employeeId: generatedEmployeeId, cafeId, startDate });
            await assignment.save({ session }); // Save the assignment
        }

        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        res.status(201).json(employee); // Respond with the created employee
    } catch (error) {
        await session.abortTransaction(); // Rollback if error occurs
        session.endSession();
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Update an existing employee
const updateEmployee = async (req, res) => {
    const { email: email_address, phone: phone_number, name, gender, cafeId } = req.body; // Destructure request body
    const session = await mongoose.startSession(); // Start a session for transactions
    session.startTransaction();
    try {
        // Find the employee by ID
        let employee = await Employee.findOne({ employeeId: req.params.id }).session(session);
        if (!employee) { // Handle employee not found
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Check if the employee's cafe assignment needs to be updated
        let empCafeAssignment = await EmployeeCafeAssignment.findOne({ employeeId: employee.employeeId }).session(session);
        let isCafeChanged = false;

        if (empCafeAssignment) { // If there's an existing assignment
            isCafeChanged = cafeId !== empCafeAssignment.cafeId; // Check if cafeId has changed
        } else if (cafeId) {
            isCafeChanged = true; // If there's no existing assignment, but cafeId is provided
        }

        const startDate = isCafeChanged ? new Date().getTime() : (empCafeAssignment ? empCafeAssignment.startDate : new Date().getTime());

        // Update employee details
        employee.name = name;
        employee.email_address = email_address;
        employee.phone_number = phone_number;
        employee.gender = gender;
        await employee.save({ session }); // Save updated employee details

        // Update or create the employee cafe assignment
        if (empCafeAssignment) {
            empCafeAssignment.cafeId = cafeId; // Update existing assignment
            empCafeAssignment.startDate = startDate;
            await empCafeAssignment.save({ session });
        } else { // Create a new assignment if none exists
            empCafeAssignment = new EmployeeCafeAssignment({
                employeeId: employee.employeeId,
                cafeId: cafeId,
                startDate: startDate
            });
            await empCafeAssignment.save({ session });
        }

        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        res.json(employee); // Respond with the updated employee
    } catch (error) {
        await session.abortTransaction(); // Rollback if error occurs
        session.endSession();
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({ employeeId: req.params.id }); // Find and delete employee by ID
        if (!employee) return res.status(404).json({ error: 'Employee not found' }); // Handle employee not found

        await EmployeeCafeAssignment.findOneAndDelete({ employeeId: employee.employeeId }); // Delete associated cafe assignment

        res.json({ message: 'Employee deleted' }); // Respond with success message
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};





// Export controller functions for use in routes
module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
