# StudentHub 🎓

An Academic & Student Management System built with a **Spring Boot** REST backend, a modern **React + Vite** frontend, and a **MySQL** database.

---

## 📁 Repository Structure

```text
StudentHub/
├── backend/                  # Spring Boot 3 REST API (Java 21 + Maven)
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/                 # React 18 + Vite SPA UI
│   ├── src/
│   ├── package.json
│   └── README.md
├── database/                 # MySQL database initialization script
│   └── studenthub.sql
├── docs/                     # Additional API documentation & guides
│   └── ACADEMIC_RECORDS_SETUP.txt
├── .gitignore                # Root Git ignore rules
└── README.md                 # Project documentation
```

---

## 🛠️ Tech Stack

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security, Maven
- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS
- **Database:** MySQL 8.x
- **API Architecture:** RESTful APIs with JSON payloads

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Java Development Kit (JDK 21+)**
- **Apache Maven 3.9+** (or use bundled Maven wrapper)
- **Node.js (v18+)** & **npm**
- **MySQL 8.x** running locally

---

### 2. Database Setup

1. Start your local MySQL service.
2. Open MySQL Workbench or run the provided script in MySQL CLI:
   ```sql
   source database/studenthub.sql;
   ```
   *(Or create a database named `studenthub` manually)*:
   ```sql
   CREATE DATABASE IF NOT EXISTS studenthub;
   ```

---

### 3. Backend Setup & Run

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Configure database credentials in `src/main/resources/application.properties` or via environment variables:
   - `DB_URL` (default: `jdbc:mysql://localhost:3306/studenthub`)
   - `DB_USERNAME` (default: `root`)
   - `DB_PASSWORD` (default: `amulyareddy26`)
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start at `http://localhost:8080`.*

---

### 4. Frontend Setup & Run

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the local URL printed in your terminal (usually `http://localhost:5173`).

---

## 📡 API Overview

Base URL: `http://localhost:8080/api`

### Students
- `GET /api/students` - Retrieve all students (supports `?search=`)
- `GET /api/students/{id}` - Retrieve student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Departments
- `GET /api/departments` - Retrieve all departments
- `POST /api/departments` - Add department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Remove department

### Academic Records
- `GET /api/academic-records` - Retrieve academic records (supports `?studentId=`)
- `POST /api/academic-records` - Add academic record
- `PUT /api/academic-records/{id}` - Update academic record
- `DELETE /api/academic-records/{id}` - Delete record
*(See [docs/ACADEMIC_RECORDS_SETUP.txt](docs/ACADEMIC_RECORDS_SETUP.txt) for sample payloads)*

### Authentication & Dashboard
- `POST /api/auth/login` - User login
- `GET /api/dashboard/stats` - Summary statistics for dashboard metrics

---

## 🔒 Security & Deployment Notes

- For production deployment, configure role-based access control and JWT authentication.
- Never commit production secrets or live database passwords to public repositories. Override credentials via system environment variables.
