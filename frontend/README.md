# StudentHub Frontend

React + Vite frontend for the StudentHub Spring Boot backend.

## Run on Windows

1. Extract this folder somewhere easy to find.
2. Open Command Prompt inside the `frontend` folder.
3. Run:

```cmd
npm install
npm run dev
```

4. Open the local URL Vite prints, usually `http://localhost:5173`.

Keep the backend running in a separate CMD window on port 8080.

## Backend API

The frontend calls:
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`
- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/{id}`
- `DELETE /api/departments/{id}`

API base URL defaults to `http://localhost:8080/api`. Set `VITE_API_BASE_URL` if yours differs.

## Important

The UI attempts to use the real backend. If the backend endpoint is protected by Spring Security or CORS is not configured, the screen will show an API error. This frontend does not bypass authentication. Configure the backend's intended login, roles, and CORS before production use.
