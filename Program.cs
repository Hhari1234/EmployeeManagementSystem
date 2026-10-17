using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Data;

var builder = WebApplication.CreateBuilder(args);

var explicitUrl = !string.IsNullOrWhiteSpace(builder.Configuration["urls"]) || !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ASPNETCORE_URLS"));
if (!explicitUrl)
{
    var port = Environment.GetEnvironmentVariable("PORT");
    var parsedPort = int.TryParse(port, out var envPort) ? envPort : 10000;
    builder.WebHost.UseKestrel(options =>
    {
        options.ListenAnyIP(parsedPort);
    });
}

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Employee Management System API",
        Version = "v1",
        Description = "A RESTful API for managing employee records."
    });
});

var configuredDbPath = Environment.GetEnvironmentVariable("DATABASE_PATH")
    ?? builder.Configuration["DatabasePath"]
    ?? Path.Combine(builder.Environment.ContentRootPath, "employees.db");

var dbDirectory = Path.GetDirectoryName(Path.GetFullPath(configuredDbPath));
if (!string.IsNullOrWhiteSpace(dbDirectory))
{
    Directory.CreateDirectory(dbDirectory);
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={configuredDbPath}"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbInitializer.Initialize(context);
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Employee Management System API v1");
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();
