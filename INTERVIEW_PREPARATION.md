# Interview Preparation

## 1. What project did you build?

I built an Employee Management System using ASP.NET Core, Entity Framework Core, and SQLite. The project allows users to add, edit, search, and delete employee records from a clean dashboard. The backend exposes a REST API and the frontend uses JavaScript to communicate with it.

## 2. What was your contribution?

My contribution was to design and implement the complete full-stack application. I created the data model, configured the database, built the API endpoints, connected the UI, and validated user input on both the frontend and backend. I also focused on handling errors, duplicate email cases, and data persistence.

## 3. What was the toughest problem you encountered?

The biggest challenge was making the CRUD flow work smoothly and consistently while keeping validation and database rules aligned. I had to ensure the UI, API, and database all respected the same validation rules, especially around duplicate emails, invalid salaries, and persistent data storage.

## 4. How did you use AI tools such as Claude or Antigravity?

I used AI as a coding assistant to speed up implementation, review code structure, and validate edge cases. I used it to help generate clean code, confirm API patterns, and check for logic gaps in the CRUD workflow and documentation. The final code was still validated and tested in the local development environment.

## 5. Where can the interviewer see the source code and screenshots?

The source code is in this project folder, and the project is prepared for GitHub upload. The README includes the setup instructions and project overview. Screenshots can be added to the README or a screenshots folder after the final demo.

## Simple explanations of key concepts

### C# and ASP.NET Core

C# is the programming language used to build the application logic. ASP.NET Core is the web framework that creates the backend web API and serves the static frontend files.

### REST APIs

REST APIs allow clients to communicate with the server using HTTP methods like GET, POST, PUT, and DELETE. In this project, the API handles employee operations and returns JSON responses.

### CRUD operations

CRUD means Create, Read, Update, and Delete. The application supports all four actions for employees through the dashboard and the backend API.

### Entity Framework Core

Entity Framework Core is the ORM used to map C# classes to database tables. It simplifies database access and allows us to work with employee objects instead of writing raw SQL.

### SQLite

SQLite is a lightweight database engine that stores employee records locally in a file. It is easy to use for small to medium applications and keeps the project quick to run and deploy locally.

### Dependency injection

Dependency injection is used to provide services like the database context and logging to controllers. This keeps the code cleaner, easier to test, and easier to maintain.

### HTTP methods and status codes

- GET is used to fetch data
- POST is used to create data
- PUT is used to update data
- DELETE is used to remove data

Status codes include:

- 200 OK for successful retrieval or update
- 201 Created for successful creation
- 400 Bad Request for invalid input
- 404 Not Found for missing records
- 409 Conflict for duplicate email addresses

### Data validation

Validation ensures the application rejects empty fields, invalid emails, negative salaries, and duplicate records. This is enforced on the frontend for user experience and on the backend as the true source of truth.

### How the frontend communicates with the backend

The frontend uses JavaScript fetch calls to send requests to the ASP.NET Core API. The API returns JSON, and the UI updates the dashboard, forms, and tables based on the response.
