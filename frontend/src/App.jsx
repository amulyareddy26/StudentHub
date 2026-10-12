import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api";

const initialStudents = [
  { id: 1, name: "Aarav Sharma", department: "Computer Science", year: "3rd Year", status: "Active" },
  { id: 2, name: "Priya Reddy", department: "Information Technology", year: "2nd Year", status: "Active" },
  { id: 3, name: "Rahul Kumar", department: "Electronics", year: "4th Year", status: "Active" },
];

const initialDepartments = [
  { id: 1, name: "Computer Science", code: "CSE" },
  { id: 2, name: "Information Technology", code: "IT" },
  { id: 3, name: "Electronics", code: "ECE" },
];

const navigation = [
  { id: "Overview", icon: "⌂" },
  { id: "Students", icon: "♙" },
  { id: "Departments", icon: "▤" },
  { id: "Academics", icon: "▣", label: "Academic records" },
];

export default function App() {
  const [page, setPage] = useState("Overview");
  const [students] = useState(initialStudents);
  const [departments] = useState(initialDepartments);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [academicError, setAcademicError] = useState("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [role, setRole] = useState("Administrator");

  useEffect(() => {
    if (page !== "Academics") return;

    let cancelled = false;

    async function loadAcademicRecords() {
      setLoadingRecords(true);
      setAcademicError("");

      try {
        const response = await fetch(`${API_URL}/academic-records`);

        if (!response.ok) {
          throw new Error(
            `The API returned status ${response.status}.`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The API response was not a list.");
        }

        if (!cancelled) {
          setAcademicRecords(data);
        }
      } catch (error) {
        if (!cancelled) {
          setAcademicError(
            error.message ||
              "Could not connect to the Academic Records API."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingRecords(false);
        }
      }
    }

    loadAcademicRecords();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const activePageLabel =
    navigation.find((item) => item.id === page)?.label || page;

  return (
    <div className="app-shell">
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f5f7fb;
          color: #182230;
        }
        button, select { font: inherit; }
        button { cursor: pointer; }
        .app-shell { min-height: 100vh; display: flex; }
        .sidebar {
          width: 245px;
          background: #17243b;
          color: white;
          padding: 26px 16px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .brand {
          font-size: 23px;
          font-weight: 800;
          padding: 0 12px 34px;
          letter-spacing: -.5px;
        }
        .brand span { color: #7da5ff; }
        .side-label {
          color: #9aa9c1;
          font-size: 11px;
          letter-spacing: 1.5px;
          font-weight: 700;
          padding: 0 12px;
          margin-bottom: 13px;
        }
        .nav-list { display: grid; gap: 7px; }
        .nav-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 0;
          color: #c7d2e4;
          background: transparent;
          padding: 13px 12px;
          border-radius: 9px;
          text-align: left;
        }
        .nav-button:hover { background: #243651; color: white; }
        .nav-button.active { background: #3b66d9; color: white; }
        .nav-icon { width: 22px; text-align: center; font-size: 18px; }
        .sidebar-bottom {
          margin-top: auto;
          padding: 18px 12px 0;
          color: #c7d2e4;
          font-size: 13px;
          border-top: 1px solid #334158;
        }
        .main { flex: 1; min-width: 0; }
        .topbar {
          height: 76px;
          background: white;
          border-bottom: 1px solid #e7ebf2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          gap: 16px;
        }
        .breadcrumb { font-size: 13px; color: #7b8798; }
        .breadcrumb strong { color: #263448; }
        .user-area { display: flex; align-items: center; gap: 12px; }
        .role-select {
          border: 1px solid #e0e5ed;
          border-radius: 8px;
          padding: 8px;
          background: white;
          color: #344054;
          max-width: 155px;
        }
        .avatar {
          width: 38px; height: 38px; border-radius: 50%;
          display: grid; place-items: center;
          color: #3155a6; background: #e4ebff; font-weight: 800;
        }
        .content { padding: 32px; max-width: 1500px; margin: auto; }
        .eyebrow {
          color: #5576c9; font-size: 11px; font-weight: 800;
          letter-spacing: 1.5px; margin: 0 0 10px;
        }
        h1 { font-size: 29px; margin: 0; letter-spacing: -.7px; }
        .subtitle { color: #778397; margin: 9px 0 25px; font-size: 14px; }
        .stats-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px; margin-bottom: 24px;
        }
        .stat-card, .panel {
          background: white; border: 1px solid #e7ebf2;
          border-radius: 13px; padding: 22px;
        }
        .stat-label { color: #788498; font-size: 13px; }
        .stat-value { font-size: 30px; font-weight: 800; margin-top: 12px; }
        .panel { margin-bottom: 22px; }
        .panel-heading, .table-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; margin-bottom: 20px;
        }
        h2 { font-size: 18px; margin: 0; }
        h3 { font-size: 16px; margin: 0 0 8px; }
        .muted { color: #788498; font-size: 13px; margin-top: 7px; }
        .primary-button {
          background: #315fd4; color: white; border: 0;
          border-radius: 8px; padding: 10px 15px;
        }
        .primary-button:hover { background: #244bb0; }
        .table-scroll { width: 100%; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; min-width: 620px; }
        .data-table th {
          text-align: left; padding: 13px 14px; font-size: 11px;
          text-transform: uppercase; letter-spacing: .7px;
          color: #7b8798; background: #f8f9fc;
        }
        .data-table td {
          padding: 16px 14px; border-bottom: 1px solid #edf0f5;
          font-size: 13px; color: #354256;
        }
        .data-table tbody tr:last-child td { border-bottom: 0; }
        .status {
          display: inline-block; border-radius: 20px;
          padding: 5px 9px; background: #e6f7ee;
          color: #21774a; font-size: 11px; font-weight: 700;
        }
        .empty-table {
          text-align: center; padding: 45px 15px;
          border: 1px dashed #dce2ec; border-radius: 10px;
        }
        .empty-table p { color: #788498; font-size: 13px; margin-bottom: 0; }
        .error-message {
          background: #fff0f0; color: #a12b2b;
          border: 1px solid #ffd7d7; padding: 14px;
          border-radius: 8px; font-size: 13px; margin-bottom: 18px;
          overflow-wrap: anywhere;
        }
        .info-message {
          background: #eef4ff; color: #3456a4;
          border-radius: 8px; padding: 13px; font-size: 13px;
        }
        @media (max-width: 760px) {
          .sidebar { width: 72px; padding: 20px 8px; }
          .brand { font-size: 0; padding: 0 0 28px; text-align: center; }
          .brand span { font-size: 22px; }
          .side-label, .nav-text, .sidebar-bottom { display: none; }
          .nav-button { justify-content: center; padding: 13px 5px; }
          .nav-icon { font-size: 20px; }
          .topbar { padding: 0 15px; }
          .content { padding: 22px 15px; }
          .stats-grid { grid-template-columns: 1fr; }
          h1 { font-size: 24px; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="brand">Student<span>Hub</span></div>
        <div className="side-label">STUDENTHUB MODULE</div>

        <nav className="nav-list">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">
                {item.label || item.id}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div>Student management system</div>
          <div style={{ marginTop: 8, color: "#91a0b8" }}>
            API workspace
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace / <strong>{activePageLabel}</strong>
          </div>
          <div className="user-area">
            <select
              className="role-select"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              aria-label="Select role"
            >
              <option>Administrator</option>
              <option>Teacher</option>
              <option>Student</option>
            </select>
            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="content">
          {page === "Overview" && (
            <OverviewPage
              students={students}
              departments={departments}
              records={academicRecords}
              onNavigate={setPage}
            />
          )}

          {page === "Students" && <StudentsPage students={students} />}

          {page === "Departments" && (
            <DepartmentsPage departments={departments} />
          )}

          {page === "Academics" && (
            <AcademicRecordsPage
              records={academicRecords}
              error={academicError}
              loading={loadingRecords}
              onRefresh={() => {
                setPage("Overview");
                setTimeout(() => setPage("Academics"), 0);
              }}
            />
          )}

          {!["Overview", "Students", "Departments", "Academics"].includes(page) && (
            <section className="panel">
              <h2>{page}</h2>
              <p className="subtitle">
                This section has not been implemented yet.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function OverviewPage({ students, departments, records, onNavigate }) {
  return (
    <>
      <p className="eyebrow">DASHBOARD</p>
      <h1>Welcome to StudentHub</h1>
      <p className="subtitle">
        Your student management workspace at a glance.
      </p>

      <div className="stats-grid">
        <StatCard label="Total students" value={students.length} />
        <StatCard label="Departments" value={departments.length} />
        <StatCard label="Academic records" value={records.length} />
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Quick access</h2>
            <p className="muted">Open a StudentHub module.</p>
          </div>
        </div>
        <div className="stats-grid">
          <button
            className="primary-button"
            onClick={() => onNavigate("Students")}
          >
            View students
          </button>
          <button
            className="primary-button"
            onClick={() => onNavigate("Departments")}
          >
            View departments
          </button>
          <button
            className="primary-button"
            onClick={() => onNavigate("Academics")}
          >
            Academic records
          </button>
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <section className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </section>
  );
}

function StudentsPage({ students }) {
  return (
    <>
      <p className="eyebrow">STUDENT DIRECTORY</p>
      <h1>Students</h1>
      <p className="subtitle">Student list currently shown from sample data.</p>

      <section className="panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td><span className="status">{student.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function DepartmentsPage({ departments }) {
  return (
    <>
      <p className="eyebrow">ORGANIZATION</p>
      <h1>Departments</h1>
      <p className="subtitle">Department list currently shown from sample data.</p>

      <section className="panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department name</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.id}</td>
                  <td>{department.name}</td>
                  <td>{department.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AcademicRecordsPage({ records, error, loading, onRefresh }) {
  const recordCount = records.length;

  return (
    <>
      <p className="eyebrow">STUDENT PERFORMANCE</p>
      <h1>Academic records</h1>
      <p className="subtitle">
        View marks, subjects, semesters, and grades loaded from your API.
      </p>

      <section className="panel">
        <div className="table-toolbar">
          <div>
            <h2>Academic records</h2>
            <p className="muted">
              {recordCount} record{recordCount === 1 ? "" : "s"} loaded from
              StudentHub.
            </p>
          </div>
          <button className="primary-button" onClick={onRefresh}>
            Refresh
          </button>
        </div>

        {loading && <p className="info-message">Loading academic records…</p>}

        {error && (
          <div className="error-message" role="alert">
            <strong>Could not load academic records.</strong>
            <p>{error}</p>
            <p>
              Check that your Spring Boot backend is running on port 8080
              and that the API is accessible.
            </p>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="empty-table">
            <h3>No academic records yet</h3>
            <p>
              The API responded successfully, but no academic records were
              returned. Add records to your database to display them here.
            </p>
          </div>
        )}

        {!error && records.length > 0 && (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Student ID</th>
                  <th>Subject</th>
                  <th>Academic year</th>
                  <th>Semester</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record.id ?? index}>
                    <td>{record.id ?? "—"}</td>
                    <td>
                      {record.student?.id ?? record.studentId ?? "—"}
                    </td>
                    <td>{record.subject ?? "—"}</td>
                    <td>{record.academicYear ?? "—"}</td>
                    <td>{record.semester ?? "—"}</td>
                    <td>
                      {record.marksObtained ?? "—"}
                      {" / "}
                      {record.maxMarks ?? "—"}
                    </td>
                    <td>{record.grade ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
```