# StudentHub backend (starter)

## Requirements
- JDK 21
- Maven 3.9+ (or use IntelliJ's Maven support)
- MySQL 8 running locally

## Configure database
Edit `src/main/resources/application.properties` or set environment variables:
- `DB_USERNAME` (default `root`)
- `DB_PASSWORD` (default `change_me`)

Create database using MySQL Workbench or run `../database/studenthub.sql`.

## Run from this folder
Windows CMD:
```cmd
mvnw.cmd spring-boot:run
```
If the Maven wrapper is not present, install Maven and run:
```cmd
mvn spring-boot:run
```

Base API: http://localhost:8080/api
- `GET /api/students`
- `GET /api/students?search=raju`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`
- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/{id}`
- `DELETE /api/departments/{id}`

Example student JSON:
```json
{
  "rollNumber": "SH001",
  "fullName": "Ravi Kumar",
  "email": "ravi@example.com",
  "phone": "9876543210",
  "yearOfStudy": 2,
  "semester": "4",
  "department": { "id": 1 }
}
```

Note: This is the initial CRUD/API foundation. Security dependencies and CORS are present, but endpoint authorization and login/JWT are not yet implemented. Do not expose this starter API publicly until authentication and role permissions are completed.
