using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<EmployeesController> _logger;

    public EmployeesController(AppDbContext context, ILogger<EmployeesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/employees
    // GET: api/employees?search=engineering
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees([FromQuery] string? search)
    {
        try
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(e =>
                    e.FullName.ToLower().Contains(searchLower) ||
                    e.Department.ToLower().Contains(searchLower) ||
                    e.Designation.ToLower().Contains(searchLower) ||
                    e.Email.ToLower().Contains(searchLower));
            }

            var employees = await query.OrderBy(e => e.Id).ToListAsync();
            return Ok(employees);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving employees");
            return StatusCode(500, new { message = "An error occurred while retrieving employees." });
        }
    }

    // GET: api/employees/summary
    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary()
    {
        try
        {
            var totalEmployees = await _context.Employees.CountAsync();
            var totalDepartments = await _context.Employees
                .Select(e => e.Department)
                .Distinct()
                .CountAsync();

            return Ok(new
            {
                totalEmployees,
                totalDepartments
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving summary");
            return StatusCode(500, new { message = "An error occurred while retrieving the summary." });
        }
    }

    // GET: api/employees/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Employee>> GetEmployee(int id)
    {
        try
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            return Ok(employee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving employee {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the employee." });
        }
    }

    // POST: api/employees
    [HttpPost]
    public async Task<ActionResult<Employee>> CreateEmployee([FromBody] Employee employee)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check for duplicate email (case-insensitive)
            var existingEmployee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email.ToLower() == employee.Email.ToLower());

            if (existingEmployee != null)
            {
                return Conflict(new { message = "An employee with this email address already exists." });
            }

            employee.CreatedAt = DateTime.UtcNow;
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error creating employee");
            if (ex.InnerException?.Message.Contains("UNIQUE", StringComparison.OrdinalIgnoreCase) == true)
            {
                return Conflict(new { message = "An employee with this email address already exists." });
            }
            return StatusCode(500, new { message = "A database error occurred while creating the employee." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating employee");
            return StatusCode(500, new { message = "An error occurred while creating the employee." });
        }
    }

    // PUT: api/employees/5
    [HttpPut("{id}")]
    public async Task<ActionResult<Employee>> UpdateEmployee(int id, [FromBody] Employee employee)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEmployee = await _context.Employees.FindAsync(id);

            if (existingEmployee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            // Check for duplicate email (case-insensitive), excluding current employee
            var duplicateEmail = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email.ToLower() == employee.Email.ToLower() && e.Id != id);

            if (duplicateEmail != null)
            {
                return Conflict(new { message = "Another employee with this email address already exists." });
            }

            existingEmployee.FullName = employee.FullName;
            existingEmployee.Email = employee.Email;
            existingEmployee.Department = employee.Department;
            existingEmployee.Designation = employee.Designation;
            existingEmployee.Salary = employee.Salary;
            existingEmployee.JoiningDate = employee.JoiningDate;

            await _context.SaveChangesAsync();

            return Ok(existingEmployee);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error updating employee {Id}", id);
            if (ex.InnerException?.Message.Contains("UNIQUE", StringComparison.OrdinalIgnoreCase) == true)
            {
                return Conflict(new { message = "Another employee with this email address already exists." });
            }
            return StatusCode(500, new { message = "A database error occurred while updating the employee." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating employee {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the employee." });
        }
    }

    // DELETE: api/employees/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        try
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Employee '{employee.FullName}' deleted successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting employee {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the employee." });
        }
    }
}
