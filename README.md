 ### README.md

# Café Employee Manager

This is a full-stack application designed to manage cafes and their employees. It consists of a **backend** API built with **Node.js** and **MongoDB**, and a **frontend** web interface built with **React** and **Vite**. The backend provides endpoints to manage cafes and employees, while the frontend consumes these APIs, offering a user-friendly interface to manage data.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup](#docker-setup)
- [Usage](#usage)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Project with Docker](#running-the-project-with-docker)
- [API Endpoints](#api-endpoints)
  - [Cafes Endpoints](#cafes-endpoints)
  - [Employees Endpoints](#employees-endpoints)
- [Frontend Pages](#frontend-pages)
  - [Cafes Page](#cafes-page)
  - [Employees Page](#employees-page)
- [Testing](#testing)
- [License](#license)

---

## Features

- **Backend**: A REST API with full CRUD operations for cafes and employees, as well as relationships between them.
- **Frontend**: A React web app that displays cafes and employees in tables, allowing you to add, edit, or delete entries.
- **Database**: MongoDB is used to store cafes, employees, and their relationships.
- **API Filtering and Sorting**: Cafes can be filtered by location, and employees by cafe.
- **Validation**: Data validation is applied on both backend and frontend (e.g., email, phone number, logo file size).

---

## Technologies

### Backend:
- **Node.js** (v18+)
- **Express.js** (for API development)
- **MongoDB** (NoSQL database)
- **Mongoose** (MongoDB object modeling)
- **Jest** (for testing)
- **Supertest** (for API testing)

### Frontend:
- **React** (for building the UI)
- **Vite** (for development and build tooling)
- **Tanstack Router** (for navigation)
- **Tanstack Query** (for state management)
- **Ag-Grid** (for displaying data tables)
- **MUI** (Material-UI) (for UI components)

---

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB and create a `.env` file at the root with the following:
   ```
   MONGO_URI=mongodb://localhost:27017/cafe_employee_manager
   ```

4. Seed the database with initial data:
   ```bash
   npm run seed
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables in a `.env` file at the root of the `frontend` folder:
   ```
   VITE_API_URL=http://localhost:3000
   ```

### Docker Setup

You can run the entire project using Docker to simplify setup and ensure compatibility across environments.

1. Ensure you have [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://www.docker.com/products/docker-desktop) have installed.
2. Make sure MongoDB is running locally (using mongo-compass or terminal) or on a remote server before running the backend.
3. Create a `.env` file in the backend directory:
   ```
   MONGO_URI=mongodb://localhost:27017
   ```
4. In the frontend directory, create a `.env` file with the following:
   ```
   VITE_API_URL=http://localhost:3000
   ```
5. Use the following command to build and start both the backend and MongoDB services:
   ```bash
   docker-compose up --build
   ```

---

## Usage

### Running the Backend

1. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run at `http://localhost:5000`.

### Running the Frontend

1. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will run at `http://localhost:5173`.

### Running the Project with Docker

1. Ensure Docker is installed and running on your system.
2. Build and start the containers using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. MongoDB, the backend, and the frontend will be automatically started:
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:5173`
   - MongoDB: `mongodb://localhost:27017`

---

## API Endpoints

### Cafes Endpoints

- **GET /cafes**: List all cafes (optional filter by location).
- **GET /cafes?location=**: Filter cafes by location.
- **POST /cafe**: Add a new café.
- **PUT /cafe**: Update an existing café.
- **DELETE /cafe**: Delete a café and its employees.

### Employees Endpoints

- **GET /employees**: List all employees.
- **GET /employees?cafe=**: List employees under a specific café.
- **POST /employee**: Add a new employee and assign them to a café.
- **PUT /employee**: Update an employee and/or their assigned café.
- **DELETE /employee**: Delete an employee.

---

## Frontend Pages

### Cafes Page

- Displays a list of cafes with the following columns:
  - **Logo**: Displays the café's logo.
  - **Name**: The name of the café.
  - **Description**: A short description of the café.
  - **Employees**: Number of employees at the café.
  - **Location**: The location of the café.
  - **Actions**: Edit and delete buttons for each café.
- Ability to filter cafes by location.
- Button to add a new café.

### Employees Page

- Displays a list of employees with the following columns:
  - **Employee ID**: The unique identifier of the employee.
  - **Name**: The employee's name.
  - **Email Address**: The employee's email address.
  - **Phone Number**: The employee's phone number.
  - **Days Worked**: The number of days the employee has worked at the café.
  - **Café Name**: The café the employee is assigned to.
  - **Actions**: Edit and delete buttons for each employee.
- Button to add a new employee.

---

## Testing

- **Backend**:
  - Run tests using Jest:
    ```bash
    npm run test
    ```

- **Frontend**:
  - Run tests using Jest and Testing Library:
    ```bash
    npm run test
    ```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Notes

- Make sure MongoDB is running locally (using mongo-compass or terminal)  or on a remote server before running the backend.
- Validation is applied to ensure correct data entry in both the frontend and backend.