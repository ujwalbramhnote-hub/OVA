# OVA - Online Voting Application

## Backend migration to MySQL

The Spring Boot backend now uses MySQL instead of the H2 file database.

### Prerequisites

- Install and start MySQL locally.
- Create the database:

```sql
CREATE DATABASE ova_db;
```

### Environment variables

Set these before starting the backend.

Windows PowerShell:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

### Run the backend

```powershell
cd backend
.\mvnw spring-boot:run
```

### Notes

- The backend listens on port `8181`.
- JPA will create or update the tables automatically.
- Demo accounts are seeded on startup:
  - `admin@demo.com / admin123`
  - `user@demo.com / user12345`
- Demo candidates are also seeded on startup, but only if they do not already exist.
- The React frontend is unchanged.
