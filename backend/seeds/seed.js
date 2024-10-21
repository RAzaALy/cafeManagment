const mongoose = require('mongoose');
const Cafe = require('../models/cafe'); // Adjust the path based on your project structure
const Employee = require('../models/employee'); // Adjust the path based on your project structure
const EmployeeCafeAssignment = require('../models/employeeCafeAssignment'); // Adjust the path based on your project structure
require('dotenv/config');
const { v4: uuidv4 } = require('uuid');


// Connect to MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to the database...'))
    .catch(err => console.error('Could not connect to the database...', err));

// Seed data for cafes and employees
const cafes = [
    { cafeId: uuidv4(), name: 'Cafe Lahore', description: 'Cozy cafe in Lahore.', logo: "", location: 'Lahore' },
    { cafeId: uuidv4(), name: 'Tea House Karachi', description: 'A tranquil spot in Karachi for tea lovers.', logo: "", location: 'Karachi' },
    { cafeId: uuidv4(), name: 'Brewed Awakening', description: 'Your local coffee shop in Karachi.', logo: "", location: 'Karachi' },
    { cafeId: uuidv4(), name: 'Cafe Islamabad', description: 'A beautiful cafe with a view in Islamabad.', logo: "", location: 'Islamabad' },
    { cafeId: uuidv4(), name: 'Coffee Corner', description: 'A favorite hangout in Lahore.', logo: "", location: 'Lahore' },
];

const employees = [
    { employeeId: 'UI1234567', name: 'John WED', email_address: 'john@example.com', phone_number: '123-456-7890', gender: 'Male' },
    { employeeId: 'UI7654321', name: 'Jane Smith', email_address: 'jane@example.com', phone_number: '098-765-4321', gender: 'Female' },
    { employeeId: 'UI1357924', name: 'Emily Johnson', email_address: 'emily@example.com', phone_number: '555-555-5555', gender: 'Female' },
    { employeeId: 'UI2468013', name: 'Michael Brown', email_address: 'michael@example.com', phone_number: '777-777-7777', gender: 'Male' },
    { employeeId: 'UI3692581', name: 'Linda Green', email_address: 'linda@example.com', phone_number: '444-444-4444', gender: 'Female' },
    { employeeId: 'UI1239874', name: 'David Wilson', email_address: 'david@example.com', phone_number: '888-888-8888', gender: 'Male' },
    { employeeId: 'UI4561237', name: 'Sarah Taylor', email_address: 'sarah@example.com', phone_number: '222-222-2222', gender: 'Female' },
    { employeeId: 'UI7894561', name: 'James Moore', email_address: 'james@example.com', phone_number: '666-666-6666', gender: 'Male' },
    { employeeId: 'UI3216548', name: 'Jessica Lee', email_address: 'jessica@example.com', phone_number: '333-333-3333', gender: 'Female' },
    { employeeId: 'UI6541237', name: 'Daniel Harris', email_address: 'daniel@example.com', phone_number: '999-999-9999', gender: 'Male' },
    { employeeId: 'UI1597538', name: 'Sophia Clark', email_address: 'sophia@example.com', phone_number: '111-111-1111', gender: 'Female' },
    { employeeId: 'UI7539514', name: 'William Lewis', email_address: 'william@example.com', phone_number: '222-333-4444', gender: 'Male' },
    { employeeId: 'UI9876543', name: 'Mia Young', email_address: 'mia@example.com', phone_number: '555-666-7777', gender: 'Female' },
    { employeeId: 'UI6549872', name: 'Ava Walker', email_address: 'ava@example.com', phone_number: '888-999-0000', gender: 'Female' },
    { employeeId: 'UI8529634', name: 'Lucas Hall', email_address: 'lucas@example.com', phone_number: '111-222-3333', gender: 'Male' },
    { employeeId: 'UI3691475', name: 'Ethan Allen', email_address: 'ethan@example.com', phone_number: '444-555-6666', gender: 'Male' },
    { employeeId: 'UI9517536', name: 'Charlotte Wright', email_address: 'charlotte@example.com', phone_number: '777-888-9999', gender: 'Female' },
    { employeeId: 'UI3214569', name: 'Benjamin King', email_address: 'benjamin@example.com', phone_number: '222-333-4444', gender: 'Male' },
    { employeeId: 'UI4569873', name: 'Zoe Scott', email_address: 'zoe@example.com', phone_number: '444-555-8888', gender: 'Female' },
    { employeeId: 'UI7891236', name: 'Chloe Adams', email_address: 'chloe@example.com', phone_number: '333-666-9999', gender: 'Female' },
    { employeeId: 'UI1472583', name: 'Henry Baker', email_address: 'henry@example.com', phone_number: '555-444-3333', gender: 'Male' },
    { employeeId: 'UI2589631', name: 'Oliver Perez', email_address: 'oliver@example.com', phone_number: '888-777-6666', gender: 'Male' },
    { employeeId: 'UI6543119', name: 'Enta ', email_address: 'emma@example.com', phone_number: '222-111-0000', gender: 'Female' },
    { employeeId: 'UI2589234', name: 'Oliver Perez', email_address: 'oliver@example.com', phone_number: '888-777-6666', gender: 'Male' },
    { employeeId: 'UI6543219', name: 'Wmma ', email_address: 'emma@example.com', phone_number: '222-111-0000', gender: 'Female' },
];


// Function to seed the database
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Cafe.deleteMany({});
        await Employee.deleteMany({});
        await EmployeeCafeAssignment.deleteMany({});

        // Insert cafes
        await Cafe.insertMany(cafes);
        console.log('Cafes seeded...');

        // Insert employees
        await Employee.insertMany(employees);
        console.log('Employees seeded...');

        // Create assignments according to the specified distribution
        const assignments = [];

        // 1st Cafe: 10 Employees
        for (let i = 0; i < 10; i++) {
            assignments.push({ employeeId: employees[i].employeeId, cafeId: cafes[0].cafeId, startDate: new Date() });
        }

        // 2nd Cafe: 5 Employees
        for (let i = 10; i < 15; i++) {
            assignments.push({ employeeId: employees[i].employeeId, cafeId: cafes[1].cafeId, startDate: new Date() });
        }

        // 3rd Cafe: 4 Employees
        for (let i = 15; i < 19; i++) {
            assignments.push({ employeeId: employees[i].employeeId, cafeId: cafes[2].cafeId, startDate: new Date() });
        }

        // 4th Cafe: 4 Employees
        for (let i = 19; i < 23; i++) {
            assignments.push({ employeeId: employees[i].employeeId, cafeId: cafes[3].cafeId, startDate: new Date() });
        }

        // 5th Cafe: 3 Employees
        for (let i = 23; i < 25; i++) {
            assignments.push({ employeeId: employees[i].employeeId, cafeId: cafes[4].cafeId, startDate: new Date() });
        }

        // Insert assignments
        await EmployeeCafeAssignment.insertMany(assignments);
        console.log('Employee assignments seeded...');

        // Close the database connection
        mongoose.connection.close();
        console.log('Database seeding completed!');
    } catch (err) {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    }
};

// Run the seeding function
seedDatabase();
