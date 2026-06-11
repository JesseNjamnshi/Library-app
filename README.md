Library Management System
Overview

The Library Management System is a full-stack web application developed using Node.js, Express.js, and MySQL. The system allows administrators and users to interact with a library database through role-based access control. Administrators have full permissions to manage records, while users are limited to viewing information.

Features
Role-based access control (Admin and User)
User authentication and login system
Book management functionality
MySQL database integration
Database triggers and events
CRUD (Create, Read, Update, Delete) operations
Secure and structured data management
Web-based user interface

Technologies Used
Node.js
Express.js
MySQL
HTML
CSS
JavaScript
Visual Studio Code
Project Structure
Library-app/
├── public/
├── database/
│   └── library_db_schema.sql
├── server.js
├── package.json
├── package-lock.json
└── README.md

Database Setup
Open MySQL Workbench.
Create a new database named library_db.
Import and execute the SQL file located in:
database/library_db_schema.sql
This file contains the database schema, tables, relationships, triggers, events, and other required database objects.
Installation
Clone the repository:
git clone https://github.com/JesseNjamnshi/Library-app.git
Navigate to the project directory:
cd Library-app
Install dependencies:
npm install
Update the database credentials in server.js.
Start the application:
node server.js
Open your browser and visit:
http://localhost:3000
Important Note

For security reasons, database credentials are not included in this repository. Before running the application, update the MySQL connection settings in server.js with your own database username and password.

Example:

const db = mysql.createConnection({
    host: "localhost",
    user: "your_username",
    password: "your_password",
    database: "library_db"
});

Never upload real passwords, API keys, or sensitive credentials to a public GitHub repository.

Learning Outcomes

This project demonstrates practical experience with:

Full-stack web development
Relational database design
SQL programming
MySQL triggers and events
User authentication and authorization
Backend API development
Database integration with Node.js
Author

Jesse Njamnshi

Computer Information Systems Graduate