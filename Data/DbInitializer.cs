using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Ensure database is created
        context.Database.EnsureCreated();

        // If there are already employees, skip seeding
        if (context.Employees.Any())
            return;

        var employees = new Employee[]
        {
            new Employee
            {
                FullName = "Alex Johnson",
                Email = "alex@example.com",
                Department = "Engineering",
                Designation = "Software Developer",
                Salary = 75000.00m,
                JoiningDate = new DateTime(2023, 1, 15),
                CreatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FullName = "Sarah Williams",
                Email = "sarah@example.com",
                Department = "Marketing",
                Designation = "Marketing Manager",
                Salary = 68000.00m,
                JoiningDate = new DateTime(2023, 3, 20),
                CreatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FullName = "Michael Chen",
                Email = "michael@example.com",
                Department = "Engineering",
                Designation = "Senior Developer",
                Salary = 92000.00m,
                JoiningDate = new DateTime(2022, 8, 10),
                CreatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FullName = "Emily Davis",
                Email = "emily@example.com",
                Department = "Human Resources",
                Designation = "HR Coordinator",
                Salary = 55000.00m,
                JoiningDate = new DateTime(2023, 6, 1),
                CreatedAt = DateTime.UtcNow
            },
            new Employee
            {
                FullName = "James Wilson",
                Email = "james@example.com",
                Department = "Finance",
                Designation = "Financial Analyst",
                Salary = 72000.00m,
                JoiningDate = new DateTime(2023, 2, 14),
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();
    }
}
