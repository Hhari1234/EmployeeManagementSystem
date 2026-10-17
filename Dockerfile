# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["EmployeeManagementSystem.csproj", "./"]
RUN dotnet restore "EmployeeManagementSystem.csproj"

COPY . .
RUN dotnet publish "EmployeeManagementSystem.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=10000
ENV DATABASE_PATH=/var/data/employees.db

RUN mkdir -p /var/data

EXPOSE 10000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "EmployeeManagementSystem.dll"]
