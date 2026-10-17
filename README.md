# Employee Management System

GitHub repository: https://github.com/Hhari1234/EmployeeManagementSystem

A full-stack ASP.NET Core Employee Management System built for quick CRUD operations, SQLite persistence, and a responsive dashboard. The project is designed to be practical, interview-friendly, and easy to deploy using Docker and Render.

## Project Overview

The application provides a professional dashboard for managing employee records. Users can add, edit, search, and delete employees while the backend stores records in SQLite and exposes REST APIs for integration and testing.

## Features

- Add new employees
- View all employees in a table
- View employee details
- Update existing records
- Delete records with confirmation
- Search by name, department, or email
- Required field, email, and salary validation
- Duplicate email prevention
- Dashboard summary cards for total employees and departments
- SQLite persistence across application restarts
- Swagger/OpenAPI API documentation
- Responsive Bootstrap 5 interface

## Technology Stack

- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- HTML5, CSS3, Bootstrap 5
- Vanilla JavaScript
- Swagger/OpenAPI
- Docker
- Render

## Prerequisites

- .NET 8 SDK
- Git
- Docker Desktop (for container testing)
- Modern browser

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Hhari1234/EmployeeManagementSystem.git
cd EmployeeManagementSystem
```

2. Restore packages:

```bash
dotnet restore
```

3. Run the application locally:

```bash
dotnet run --urls http://localhost:5010
```

4. Open the application:

- Dashboard: http://localhost:5010/
- Swagger: http://localhost:5010/swagger

## Environment Variables

The app supports:

- `PORT` — Render or container port. Defaults to `10000`.
- `DATABASE_PATH` — SQLite database file path. Defaults to the project root `employees.db` in local development.

Example:

```bash
$env:DATABASE_PATH="C:\temp\employees.db"
$env:PORT="5000"
dotnet run
```

## Database Persistence

SQLite is used for quick local setup and demonstration. For deployment, the application supports a configurable `DATABASE_PATH`, such as a mounted persistent volume on Render.

Important limitation:

- SQLite on ephemeral filesystems is not reliable for long-term data persistence.
- If a Render service is restarted without a persistent disk, data may be lost.
- Use a persistent disk or managed database for production-grade storage.

## Docker

### Build the Docker image

```bash
docker build -t employee-management-system .
```

### Run the Docker container locally

```bash
docker run --rm -p 10000:10000 -e PORT=10000 -e DATABASE_PATH=/var/data/employees.db employee-management-system
```

For local persistence, mount a Docker volume:

```bash
docker run --rm -p 10000:10000 -e PORT=10000 -e DATABASE_PATH=/var/data/employees.db -v employee_data:/var/data employee-management-system
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/employees | Get all employees |
| GET | /api/employees/{id} | Get a single employee |
| POST | /api/employees | Create a new employee |
| PUT | /api/employees/{id} | Update an employee |
| DELETE | /api/employees/{id} | Delete an employee |
| GET | /api/employees?search=engineering | Search by name, department, or email |
| GET | /api/employees/summary | Get dashboard summary |

## Render Deployment

1. Push the project to GitHub.
2. Log in to Render.
3. Create a new Web Service.
4. Connect the existing GitHub repository: https://github.com/Hhari1234/EmployeeManagementSystem
5. Select the `main` branch.
6. Choose the Docker runtime.
7. Use the repository root Dockerfile.
8. Set environment variables:
   - `PORT=10000`
   - `DATABASE_PATH=/var/data/employees.db`
9. Add a persistent disk if you need data retention.
10. Deploy and confirm the service is live.

## Project Structure

```text
EmployeeManagementSystem/
├── Controllers/
│   └── EmployeesController.cs
├── Data/
│   ├── AppDbContext.cs
│   └── DbInitializer.cs
├── Models/
│   └── Employee.cs
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── index.html
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
├── EmployeeManagementSystem.csproj
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
├── INTERVIEW_PREPARATION.md
└── obj/
```

## Screenshots

Add screenshots here for:

- Dashboard overview
- Employee form
- Search and list view
- Swagger UI
- Render deployment screen

## Future Improvements

- Add authentication and authorization
- Add pagination and sorting
- Add export to CSV/PDF
- Add unit/integration tests
- Add department management
- Move to a managed database for production workloads

## Notes

This project is intentionally simple and focused on delivering a working full-stack MVP with real CRUD logic, validation, persistent storage, and a clean dashboard UI.
