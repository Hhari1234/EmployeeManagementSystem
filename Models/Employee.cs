using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagementSystem.Models;

public class Employee
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required(ErrorMessage = "Full name is required.")]
    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department is required.")]
    [StringLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required(ErrorMessage = "Designation is required.")]
    [StringLength(100)]
    public string Designation { get; set; } = string.Empty;

    [Required(ErrorMessage = "Salary is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Salary must be greater than zero.")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Salary { get; set; }

    [Required(ErrorMessage = "Joining date is required.")]
    [DataType(DataType.Date)]
    public DateTime JoiningDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
