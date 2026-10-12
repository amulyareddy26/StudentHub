import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  GraduationCap, LayoutDashboard, Users, Building2, BookOpen,
  Settings, Search, Bell, Plus, Download, MoreHorizontal,
  TrendingUp, ArrowUpRight, Menu, X, RefreshCw, Pencil, Trash2,
  CheckCircle2, AlertCircle, LogIn, LogOut, ChevronDown, ShieldCheck,
  Eye, EyeOff, UserCheck, Award, FileText, Check, Phone, Mail, Filter, BarChart3
} from 'lucide-react';
import './styles.css';

const API = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

// Helper for initial demo user
const DEFAULT_USER = {
  id: 1,
  username: 'admin',
  fullName: 'Dr. Rajesh Sharma (Dean)',
  email: 'admin@studenthub.edu',
  role: 'ADMIN',
  token: 'demo_token'
};

function App() {
  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sh_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // App navigation
  const [page, setPage] = useState('Dashboard');
  const [mobileNav, setMobileNav] = useState(false);

  // Data states
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    rollNumber: '', fullName: '', email: '', phone: '',
    gender: 'Male', yearOfStudy: '1', semester: '1', departmentId: ''
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ code: '', name: '', description: '' });

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordForm, setRecordForm] = useState({
    studentId: '', subject: '', semester: '1', academicYear: '2025-2026',
    marksObtained: '85', maxMarks: '100', grade: 'A', cgpa: '8.9',
    attendance: '90', remarks: 'Good academic performance'
  });

  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '', password: '', email: '', fullName: '', role: 'STUDENT'
  });

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function apiRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
      ...(options.headers || {})
    };
    const response = await fetch(`${API}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      let detail = `Error ${response.status}: ${response.statusText}`;
      try {
        const body = await response.json();
        detail = body.message || body.error || detail;
      } catch {}
      throw new Error(detail);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function loadAllData() {
    setLoading(true);
    try {
      const [stuRes, deptRes, statsRes, recordsRes] = await Promise.allSettled([
        apiRequest('/students'),
        apiRequest('/departments'),
        apiRequest('/dashboard/stats'),
        apiRequest('/academic-records')
      ]);

      if (stuRes.status === 'fulfilled' && stuRes.value) {
        setStudents(Array.isArray(stuRes.value) ? stuRes.value : []);
      }
      if (deptRes.status === 'fulfilled' && deptRes.value) {
        setDepartments(Array.isArray(deptRes.value) ? deptRes.value : []);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setDashboardStats(statsRes.value);
      }
      if (recordsRes.status === 'fulfilled' && recordsRes.value) {
        setAcademicRecords(Array.isArray(recordsRes.value) ? recordsRes.value : []);
      }
      if (user?.role === 'ADMIN') {
        try {
          const uRes = await apiRequest('/users');
          if (Array.isArray(uRes)) setUsersList(uRes);
        } catch {}
      }
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, [user]);

  // Auth Functions
  async function handleLogin(e) {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      if (res && res.success) {
        const newUser = {
          id: res.id,
          username: res.username,
          fullName: res.fullName || res.username,
          email: res.email,
          role: res.role,
          token: res.token
        };
        setUser(newUser);
        localStorage.setItem('sh_user', JSON.stringify(newUser));
        setShowLoginModal(false);
        showToast(`Welcome back, ${newUser.fullName}! (${newUser.role})`);
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('sh_user');
    setShowLoginModal(true);
    showToast('Logged out successfully', 'info');
  }

  function pickDemoRole(role) {
    if (role === 'ADMIN') setLoginForm({ username: 'admin', password: 'admin123' });
    if (role === 'FACULTY') setLoginForm({ username: 'faculty', password: 'faculty123' });
    if (role === 'STUDENT') setLoginForm({ username: 'student', password: 'student123' });
  }

  // Student CRUD
  function openAddStudent() {
    setEditingStudent(null);
    setStudentForm({
      rollNumber: `SH${new Date().getFullYear()}${String(students.length + 1).padStart(2, '0')}`,
      fullName: '',
      email: '',
      phone: '',
      gender: 'Male',
      yearOfStudy: '1',
      semester: '1',
      departmentId: departments[0]?.id || ''
    });
    setShowStudentModal(true);
  }

  function openEditStudent(student) {
    setEditingStudent(student);
    setStudentForm({
      rollNumber: student.rollNumber || '',
      fullName: student.fullName || '',
      email: student.email || '',
      phone: student.phone || '',
      gender: student.gender || 'Male',
      yearOfStudy: String(student.yearOfStudy || '1'),
      semester: String(student.semester || '1'),
      departmentId: student.departmentId || student.department?.id || ''
    });
    setShowStudentModal(true);
  }

  async function saveStudent(e) {
    e.preventDefault();
    try {
      const payload = {
        ...studentForm,
        yearOfStudy: parseInt(studentForm.yearOfStudy, 10),
        departmentId: studentForm.departmentId ? Number(studentForm.departmentId) : null
      };

      if (editingStudent) {
        await apiRequest(`/students/${editingStudent.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast(`Updated student ${studentForm.fullName}`);
      } else {
        await apiRequest('/students', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast(`Added student ${studentForm.fullName}`);
      }
      setShowStudentModal(false);
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Are you sure you want to delete student "${student.fullName}" (${student.rollNumber})?`)) return;
    try {
      await apiRequest(`/students/${student.id}`, { method: 'DELETE' });
      showToast(`Student ${student.fullName} deleted`);
      await loadAllData();
      if (selectedStudent?.id === student.id) setShowProfileModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Department CRUD
  function openAddDept() {
    setEditingDept(null);
    setDeptForm({ code: '', name: '', description: '' });
    setShowDeptModal(true);
  }

  function openEditDept(dept) {
    setEditingDept(dept);
    setDeptForm({ code: dept.code || '', name: dept.name || '', description: dept.description || '' });
    setShowDeptModal(true);
  }

  async function saveDepartment(e) {
    e.preventDefault();
    try {
      if (editingDept) {
        await apiRequest(`/departments/${editingDept.id}`, {
          method: 'PUT',
          body: JSON.stringify(deptForm)
        });
        showToast(`Updated department ${deptForm.name}`);
      } else {
        await apiRequest('/departments', {
          method: 'POST',
          body: JSON.stringify(deptForm)
        });
        showToast(`Created department ${deptForm.name}`);
      }
      setShowDeptModal(false);
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function deleteDepartment(dept) {
    if (!window.confirm(`Delete department "${dept.name}"?`)) return;
    try {
      await apiRequest(`/departments/${dept.id}`, { method: 'DELETE' });
      showToast(`Department ${dept.name} deleted`);
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Academic Records CRUD
  function openAddRecord(student = null) {
    setEditingRecord(null);
    const targetStudentId = student?.id || selectedStudent?.id || students[0]?.id || '';
    setRecordForm({
      studentId: targetStudentId,
      subject: '',
      semester: student?.semester || selectedStudent?.semester || '1',
      academicYear: '2025-2026',
      marksObtained: '85',
      maxMarks: '100',
      grade: 'A',
      cgpa: '8.9',
      attendance: '92',
      remarks: 'Good progress'
    });
    setShowRecordModal(true);
  }

  function openEditRecord(record) {
    setEditingRecord(record);
    setRecordForm({
      studentId: record.studentId || '',
      subject: record.subject || '',
      semester: record.semester || '1',
      academicYear: record.academicYear || '2025-2026',
      marksObtained: String(record.marksObtained ?? '85'),
      maxMarks: String(record.maxMarks ?? '100'),
      grade: record.grade || 'A',
      cgpa: String(record.cgpa ?? '8.5'),
      attendance: String(record.attendance ?? '90'),
      remarks: record.remarks || ''
    });
    setShowRecordModal(true);
  }

  async function saveRecord(e) {
    e.preventDefault();
    try {
      const marks = parseFloat(recordForm.marksObtained);
      const max = parseFloat(recordForm.maxMarks);
      const pct = max > 0 ? (marks / max) * 100 : 0;
      let calculatedGrade = 'F';
      if (pct >= 90) calculatedGrade = 'A+';
      else if (pct >= 80) calculatedGrade = 'A';
      else if (pct >= 70) calculatedGrade = 'B+';
      else if (pct >= 60) calculatedGrade = 'B';
      else if (pct >= 50) calculatedGrade = 'C';
      else if (pct >= 40) calculatedGrade = 'D';

      const payload = {
        studentId: Number(recordForm.studentId),
        subject: recordForm.subject.trim(),
        semester: recordForm.semester,
        academicYear: recordForm.academicYear,
        marksObtained: marks,
        maxMarks: max,
        grade: calculatedGrade,
        cgpa: parseFloat(recordForm.cgpa) || parseFloat((pct / 9.5).toFixed(2)),
        attendance: parseFloat(recordForm.attendance) || 90,
        remarks: recordForm.remarks
      };

      if (editingRecord) {
        await apiRequest(`/academic-records/${editingRecord.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Academic record updated');
      } else {
        await apiRequest('/academic-records', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Academic record added');
      }
      setShowRecordModal(false);
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function deleteRecord(record) {
    if (!window.confirm(`Delete record for ${record.subject}?`)) return;
    try {
      await apiRequest(`/academic-records/${record.id}`, { method: 'DELETE' });
      showToast('Record deleted');
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // User CRUD
  async function saveUser(e) {
    e.preventDefault();
    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userForm)
      });
      showToast(`User account created: ${userForm.username}`);
      setShowUserModal(false);
      setUserForm({ username: '', password: '', email: '', fullName: '', role: 'STUDENT' });
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Filtered lists
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q));

      const matchDept = !filterDept || String(s.departmentId || s.department?.id) === String(filterDept);
      const matchYear = !filterYear || String(s.yearOfStudy) === String(filterYear);
      const matchGender = !filterGender || (s.gender && s.gender.toLowerCase() === filterGender.toLowerCase());

      return matchSearch && matchDept && matchYear && matchGender;
    });
  }, [students, search, filterDept, filterYear, filterGender]);

  const filteredRecords = useMemo(() => {
    return academicRecords.filter(r => {
      const matchSem = !filterSemester || String(r.semester) === String(filterSemester);
      const matchSearch = !search ||
        (r.subject && r.subject.toLowerCase().includes(search.toLowerCase())) ||
        (r.studentName && r.studentName.toLowerCase().includes(search.toLowerCase())) ||
        (r.studentRollNumber && r.studentRollNumber.toLowerCase().includes(search.toLowerCase()));
      return matchSem && matchSearch;
    });
  }, [academicRecords, filterSemester, search]);

  const studentRecords = useMemo(() => {
    if (!selectedStudent) return [];
    return academicRecords.filter(r => r.studentId === selectedStudent.id);
  }, [academicRecords, selectedStudent]);

  // Export CSV
  function exportStudentsCSV() {
    const headers = ['Roll Number', 'Full Name', 'Email', 'Phone', 'Gender', 'Year', 'Semester', 'Department'];
    const rows = filteredStudents.map(s => [
      `"${s.rollNumber || ''}"`,
      `"${s.fullName || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.gender || ''}"`,
      `"${s.yearOfStudy || ''}"`,
      `"${s.semester || ''}"`,
      `"${s.departmentName || s.department?.name || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentHub_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student list exported to CSV');
  }

  const navItems = [
    { label: 'OVERVIEW', items: [
      { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Students', label: 'Students', icon: Users, badge: students.length },
      { id: 'Departments', label: 'Departments', icon: Building2, badge: departments.length },
      { id: 'Academic Records', label: 'Academic Records', icon: BookOpen, badge: academicRecords.length },
      { id: 'Reports', label: 'Reports & Analytics', icon: BarChart3 }
    ]},
    { label: 'SYSTEM', items: [
      ...(user?.role === 'ADMIN' ? [{ id: 'Users', label: 'User & Roles', icon: ShieldCheck, badge: usersList.length || '3' }] : []),
      { id: 'Settings', label: 'System Settings', icon: Settings }
    ]}
  ];

  return (
    <div className="app-shell">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-bar ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <span>Student<span className="brand-accent">Hub</span></span>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} style={{ marginLeft: 'auto', display: 'none' }}>
            <X size={16} />
          </button>
        </div>

        <div className="workspace-badge">
          <div className="workspace-avatar">SU</div>
          <div className="workspace-meta">
            <strong>StudentHub Portal</strong>
            <small>Academic Management</small>
          </div>
        </div>

        {navItems.map(group => (
          <div className="nav-group" key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => { setPage(item.id); setMobileNav(false); }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && <span className="nav-count">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}

        <div className="sidebar-bottom">
          {user ? (
            <div className="user-profile-widget">
              <div className={`user-avatar ${user.role.toLowerCase()}`}>
                {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="user-info">
                <strong>{user.fullName}</strong>
                <span className={`user-role-tag role-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
              <button
                className="btn-danger-sm"
                title="Logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowLoginModal(true)}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="icon-button" onClick={() => setMobileNav(!mobileNav)} style={{ display: 'none' }}>
              <Menu size={18} />
            </button>
            <div className="breadcrumb">
              StudentHub <span>/</span> <strong>{page}</strong>
            </div>
          </div>

          <div className="top-actions">
            <div className="connection-badge">
              <span className="pulse-dot" /> Spring Boot API Live
            </div>
            <button className="icon-button" title="Refresh API Data" onClick={loadAllData}>
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            {user ? (
              <button
                className="user-role-tag role-admin"
                style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setShowLoginModal(true)}
                title="Switch User / Role"
              >
                <UserCheck size={14} /> Switch Role: <strong>{user.role}</strong>
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setShowLoginModal(true)}>
                <LogIn size={15} /> Login
              </button>
            )}
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="content">
          {/* 1. DASHBOARD PAGE */}
          {page === 'Dashboard' && (
            <div>
              <div className="welcome-banner">
                <div className="welcome-copy">
                  <div className="welcome-tag">
                    <Award size={14} /> Academic Management System 2026
                  </div>
                  <h1>Welcome to StudentHub, {user?.fullName || 'Academic Administrator'}!</h1>
                  <p>
                    Manage student profiles, department enrollments, and academic transcripts in real time with our centralized Java Spring Boot & MySQL platform.
                  </p>
                  <div className="welcome-buttons">
                    <button className="btn-primary-light" onClick={openAddStudent}>
                      <Plus size={16} /> Add New Student
                    </button>
                    <button className="btn-secondary-light" onClick={openAddDept}>
                      <Building2 size={16} /> Add Department
                    </button>
                    <button className="btn-secondary-light" onClick={() => openAddRecord()}>
                      <BookOpen size={16} /> Record Grades
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI STATS CARDS */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon blue"><Users size={22} /></div>
                    <span className="badge badge-blue">Active</span>
                  </div>
                  <div className="stat-label">TOTAL REGISTERED STUDENTS</div>
                  <div className="stat-value">{dashboardStats?.totalStudents ?? students.length}</div>
                  <div className="stat-foot">Enrolled across all academic departments</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon purple"><Building2 size={22} /></div>
                    <span className="badge badge-purple">Faculties</span>
                  </div>
                  <div className="stat-label">DEPARTMENTS & DISCIPLINES</div>
                  <div className="stat-value">{dashboardStats?.totalDepartments ?? departments.length}</div>
                  <div className="stat-foot">Engineering & Computing branches</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon emerald"><Award size={22} /></div>
                    <span className="badge badge-emerald">Semesters</span>
                  </div>
                  <div className="stat-label">ACADEMIC EXAM RECORDS</div>
                  <div className="stat-value">{dashboardStats?.totalAcademicRecords ?? academicRecords.length}</div>
                  <div className="stat-foot">Verified course examination entries</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon amber"><TrendingUp size={22} /></div>
                    <span className="badge badge-amber">Average</span>
                  </div>
                  <div className="stat-label">INSTITUTION AVERAGE SCORE</div>
                  <div className="stat-value">{dashboardStats?.averageMarksPercentage ? `${dashboardStats.averageMarksPercentage}%` : '88.5%'}</div>
                  <div className="stat-foot">Overall course performance index</div>
                </div>
              </div>

              {/* DASHBOARD GRID: DEPARTMENTS & RECENT STUDENTS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '24px' }}>
                {/* Recent Students Table */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Recent Student Registrations</h2>
                      <p>Latest active entries in the institutional database</p>
                    </div>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setPage('Students')}>
                      View All Students <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Full Name</th>
                          <th>Department</th>
                          <th>Year / Sem</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 5).map(s => (
                          <tr key={s.id}>
                            <td><span className="badge badge-blue">{s.rollNumber}</span></td>
                            <td>
                              <strong style={{ color: 'var(--ink)' }}>{s.fullName}</strong>
                              <small style={{ display: 'block', color: 'var(--muted)', fontSize: '11px' }}>{s.email}</small>
                            </td>
                            <td>
                              <span className="badge badge-purple">{s.departmentCode || s.departmentName || s.department?.name || 'CSE'}</span>
                            </td>
                            <td>Year {s.yearOfStudy || 1} • Sem {s.semester || 1}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="icon-button" style={{ width: '28px', height: '28px' }} title="View Profile" onClick={() => { setSelectedStudent(s); setShowProfileModal(true); }}>
                                  <Eye size={14} />
                                </button>
                                <button className="icon-button" style={{ width: '28px', height: '28px' }} title="Edit Student" onClick={() => openEditStudent(s)}>
                                  <Pencil size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!students.length && (
                          <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No student records found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Department Distribution Chart / Breakdown */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Department Distribution</h2>
                      <p>Enrollment breakdown by branch</p>
                    </div>
                    <button className="icon-button" onClick={openAddDept} title="New Department">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    {departments.map((dept, idx) => {
                      const count = dept.studentCount || students.filter(s => String(s.departmentId || s.department?.id) === String(dept.id)).length;
                      const pct = students.length ? Math.round((count / students.length) * 100) : 0;
                      return (
                        <div key={dept.id || idx} style={{ marginBottom: '18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                            <strong style={{ color: 'var(--ink)' }}>
                              <span className="badge badge-slate" style={{ marginRight: '8px' }}>{dept.code || 'DEPT'}</span>
                              {dept.name}
                            </strong>
                            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{count} students ({pct}%)</span>
                          </div>
                          <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${Math.max(5, pct)}%`,
                              background: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--purple)' : 'var(--success)',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>
                      );
                    })}
                    {!departments.length && (
                      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>No departments found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDENTS MANAGEMENT PAGE */}
          {page === 'Students' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ font: '800 28px Manrope', margin: '0 0 6px', color: 'var(--ink)' }}>
                    Student Management
                  </h1>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
                    Centralized database of students, contact records, and academic placements.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" onClick={exportStudentsCSV}>
                    <Download size={16} /> Export CSV
                  </button>
                  <button className="btn-primary" onClick={openAddStudent}>
                    <Plus size={16} /> Add Student
                  </button>
                </div>
              </div>

              {/* SEARCH & FILTERS TOOLBAR */}
              <div className="panel">
                <div className="panel-toolbar">
                  <div className="search-wrapper">
                    <Search size={16} color="#94a3b8" />
                    <input
                      placeholder="Search by name, roll no, email, phone..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    {search && <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
                  </div>

                  <div className="filter-group">
                    {/* Department filter */}
                    <select
                      className="filter-select"
                      value={filterDept}
                      onChange={e => setFilterDept(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.code ? `[${d.code}] ` : ''}{d.name}</option>
                      ))}
                    </select>

                    {/* Year of study filter */}
                    <select
                      className="filter-select"
                      value={filterYear}
                      onChange={e => setFilterYear(e.target.value)}
                    >
                      <option value="">All Academic Years</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>

                    {/* Gender filter */}
                    <select
                      className="filter-select"
                      value={filterGender}
                      onChange={e => setFilterGender(e.target.value)}
                    >
                      <option value="">All Genders</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>

                    {(filterDept || filterYear || filterGender || search) && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                        onClick={() => { setFilterDept(''); setFilterYear(''); setFilterGender(''); setSearch(''); }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* STUDENTS TABLE */}
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th>Contact Details</th>
                        <th>Gender</th>
                        <th>Department</th>
                        <th>Year & Semester</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(s => (
                        <tr key={s.id}>
                          <td>
                            <span className="badge badge-blue">{s.rollNumber}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="user-avatar student" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                                {s.fullName ? s.fullName.slice(0, 2).toUpperCase() : 'ST'}
                              </div>
                              <div>
                                <strong style={{ color: 'var(--ink)', display: 'block', fontSize: '13px' }}>{s.fullName}</strong>
                                <small style={{ color: 'var(--muted)', fontSize: '11px' }}>ID #{s.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Mail size={12} color="#94a3b8" /> {s.email}
                              </span>
                              {s.phone && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                                  <Phone size={12} color="#94a3b8" /> {s.phone}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${s.gender === 'Female' ? 'badge-rose' : s.gender === 'Male' ? 'badge-blue' : 'badge-slate'}`}>
                              {s.gender || 'Other'}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-purple">
                              {s.departmentCode || s.departmentName || s.department?.name || 'Unassigned'}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-slate">Year {s.yearOfStudy || 1} • Sem {s.semester || 1}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                className="icon-button"
                                title="View Comprehensive Profile & Grades"
                                onClick={() => { setSelectedStudent(s); setShowProfileModal(true); }}
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                className="icon-button"
                                title="Edit Student"
                                onClick={() => openEditStudent(s)}
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                className="icon-button"
                                style={{ color: 'var(--danger)' }}
                                title="Delete Student"
                                onClick={() => deleteStudent(s)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!filteredStudents.length && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '50px 20px' }}>
                            <div style={{ maxWidth: '320px', margin: '0 auto', color: 'var(--muted)' }}>
                              <Users size={36} style={{ margin: '0 auto 12px', display: 'block', color: '#cbd5e1' }} />
                              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px', marginBottom: '6px' }}>
                                No Students Match Your Filters
                              </strong>
                              <span>Try adjusting search query or clearing your filter criteria.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--line)', background: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                  <span>Showing {filteredStudents.length} of {students.length} students</span>
                  <span>Institutional Database System</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. DEPARTMENTS PAGE */}
          {page === 'Departments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ font: '800 28px Manrope', margin: '0 0 6px', color: 'var(--ink)' }}>
                    Academic Departments
                  </h1>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
                    Manage educational faculties, program branches, and student allocations.
                  </p>
                </div>
                <button className="btn-primary" onClick={openAddDept}>
                  <Plus size={16} /> Add Department
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {departments.map(dept => {
                  const studentCount = dept.studentCount || students.filter(s => String(s.departmentId || s.department?.id) === String(dept.id)).length;
                  return (
                    <div key={dept.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span className="badge badge-purple" style={{ fontSize: '13px', padding: '4px 10px' }}>
                            {dept.code || 'DEPT'}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="icon-button" style={{ width: '28px', height: '28px' }} onClick={() => openEditDept(dept)} title="Edit">
                              <Pencil size={13} />
                            </button>
                            <button className="icon-button" style={{ width: '28px', height: '28px', color: 'var(--danger)' }} onClick={() => deleteDepartment(dept)} title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <h3 style={{ font: '800 18px Manrope', color: 'var(--ink)', margin: '14px 0 8px' }}>
                          {dept.name}
                        </h3>
                        <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>
                          {dept.description || 'Dedicated academic engineering branch.'}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Enrolled Students</span>
                        <span className="badge badge-blue" style={{ fontSize: '12px' }}>
                          {studentCount} Students
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. ACADEMIC RECORDS PAGE */}
          {page === 'Academic Records' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ font: '800 28px Manrope', margin: '0 0 6px', color: 'var(--ink)' }}>
                    Academic Records & Examination Transcripts
                  </h1>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
                    Track course grades, semester marks, SGPA/CGPA, and attendance across all students.
                  </p>
                </div>
                <button className="btn-primary" onClick={() => openAddRecord()}>
                  <Plus size={16} /> Record Course Grades
                </button>
              </div>

              <div className="panel">
                <div className="panel-toolbar">
                  <div className="search-wrapper">
                    <Search size={16} color="#94a3b8" />
                    <input
                      placeholder="Filter by subject or student..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="filter-group">
                    <select
                      className="filter-select"
                      value={filterSemester}
                      onChange={e => setFilterSemester(e.target.value)}
                    >
                      <option value="">All Semesters</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject / Course</th>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>Semester</th>
                        <th>Marks Obtained</th>
                        <th>Grade</th>
                        <th>CGPA</th>
                        <th>Attendance</th>
                        <th>Remarks</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map(r => (
                        <tr key={r.id}>
                          <td>
                            <strong style={{ color: 'var(--ink)', fontSize: '13px' }}>{r.subject}</strong>
                            <small style={{ display: 'block', color: 'var(--muted)', fontSize: '11px' }}>{r.academicYear || '2025-2026'}</small>
                          </td>
                          <td>{r.studentName || 'Student'}</td>
                          <td><span className="badge badge-slate">{r.studentRollNumber || '—'}</span></td>
                          <td>Sem {r.semester}</td>
                          <td>
                            <strong>{r.marksObtained}</strong> / {r.maxMarks}
                            <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                              ({Math.round((r.marksObtained / r.maxMarks) * 100)}%)
                            </span>
                          </td>
                          <td>
                            <span className={`grade-badge grade-${(r.grade || 'A').toLowerCase().replace('+', 'plus')}`}>
                              {r.grade || 'A'}
                            </span>
                          </td>
                          <td><strong>{r.cgpa || '8.5'}</strong></td>
                          <td>
                            <span className="badge badge-emerald">{r.attendance ? `${r.attendance}%` : '92%'}</span>
                          </td>
                          <td><small style={{ color: 'var(--muted)' }}>{r.remarks || '—'}</small></td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button className="icon-button" onClick={() => openEditRecord(r)} title="Edit Record">
                                <Pencil size={14} />
                              </button>
                              <button className="icon-button" style={{ color: 'var(--danger)' }} onClick={() => deleteRecord(r)} title="Delete Record">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!filteredRecords.length && (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                            No academic records found for this selection.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. USER MANAGEMENT (Admin Only) */}
          {page === 'Users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ font: '800 28px Manrope', margin: '0 0 6px', color: 'var(--ink)' }}>
                    System Users & Role Management
                  </h1>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
                    Control role-based privileges: Administrator, Faculty Member, and Student accounts.
                  </p>
                </div>
                <button className="btn-primary" onClick={() => setShowUserModal(true)}>
                  <Plus size={16} /> Add User Account
                </button>
              </div>

              <div className="panel">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Assigned Role</th>
                        <th>Account Status</th>
                        <th>Date Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.username}</strong></td>
                          <td>{u.fullName || '—'}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`user-role-tag role-${u.role.toLowerCase()}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-emerald">ACTIVE</span>
                          </td>
                          <td><small style={{ color: 'var(--muted)' }}>{u.createdAt ? String(u.createdAt).slice(0, 10) : '2026-10-11'}</small></td>
                        </tr>
                      ))}
                      {!usersList.length && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Loading system users...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. REPORTS & ANALYTICS PAGE */}
          {page === 'Reports' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ font: '800 28px Manrope', margin: '0 0 6px', color: 'var(--ink)' }}>
                    Academic Analytics & Reports
                  </h1>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
                    Institutional summaries, enrollment breakdowns, and academic standing reports.
                  </p>
                </div>
                <button className="btn-secondary" onClick={() => window.print()}>
                  <Download size={16} /> Print Official Summary
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                <div className="panel" style={{ padding: '24px' }}>
                  <h3 style={{ font: '800 17px Manrope', margin: '0 0 16px' }}>Enrollment Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Registered Students:</span>
                      <strong>{students.length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Academic Departments:</span>
                      <strong>{departments.length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Course Grade Records:</span>
                      <strong>{academicRecords.length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Database Engine:</span>
                      <strong style={{ color: 'var(--primary)' }}>MySQL 8 (InnoDB)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Backend Architecture:</span>
                      <strong style={{ color: 'var(--primary)' }}>Spring Boot 3.4.5</strong>
                    </div>
                  </div>
                </div>

                <div className="panel" style={{ padding: '24px' }}>
                  <h3 style={{ font: '800 17px Manrope', margin: '0 0 16px' }}>Department Enrollment Share</h3>
                  {departments.map(d => {
                    const count = d.studentCount || students.filter(s => String(s.departmentId || s.department?.id) === String(d.id)).length;
                    const pct = students.length ? Math.round((count / students.length) * 100) : 0;
                    return (
                      <div key={d.id} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span>{d.name} ({d.code})</span>
                          <strong>{count} students ({pct}%)</strong>
                        </div>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 7. SETTINGS PAGE */}
          {page === 'Settings' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ font: '800 28px Manrope', margin: '0 0 6px', color: 'var(--ink)' }}>
                  System Settings & Connectivity
                </h1>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
                  Configure REST base URL endpoints, verify database status, and test services.
                </p>
              </div>

              <div className="panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line-light)', paddingBottom: '16px' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Spring Boot Backend REST API</strong>
                      <small style={{ color: 'var(--muted)' }}>Endpoint: {API}</small>
                    </div>
                    <span className="badge badge-emerald">Connected (Port 8080)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line-light)', paddingBottom: '16px' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Database Engine</strong>
                      <small style={{ color: 'var(--muted)' }}>MySQL 8 via Spring Data JPA / Hibernate</small>
                    </div>
                    <span className="badge badge-emerald">Schema: studenthub</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Reload System Cache</strong>
                      <small style={{ color: 'var(--muted)' }}>Synchronize client state with database</small>
                    </div>
                    <button className="btn-secondary" onClick={loadAllData}>
                      <RefreshCw size={14} /> Synchronize Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADD / EDIT STUDENT */}
      {showStudentModal && (
        <div className="modal-overlay" onClick={() => setShowStudentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{editingStudent ? 'Edit Student Record' : 'Enroll New Student'}</h3>
                <p>Ensure roll numbers and email addresses are unique in the institution.</p>
              </div>
              <button className="icon-button" onClick={() => setShowStudentModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={saveStudent}>
              <div className="modal-form">
                <div className="form-section-title">1. Personal Information</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Roll Number *</label>
                    <input
                      required
                      placeholder="e.g. SH202601"
                      value={studentForm.rollNumber}
                      onChange={e => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      required
                      placeholder="e.g. Amulya Reddy"
                      value={studentForm.fullName}
                      onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={studentForm.gender}
                      onChange={e => setStudentForm({ ...studentForm, gender: e.target.value })}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      placeholder="e.g. 9876543210"
                      value={studentForm.phone}
                      onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-section-title">2. Contact Information</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="student@studenthub.edu"
                      value={studentForm.email}
                      onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-section-title">3. Academic Placement</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Department / Discipline *</label>
                    <select
                      required
                      value={studentForm.departmentId}
                      onChange={e => setStudentForm({ ...studentForm, departmentId: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>[{d.code || 'DEPT'}] {d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year of Study</label>
                    <select
                      value={studentForm.yearOfStudy}
                      onChange={e => setStudentForm({ ...studentForm, yearOfStudy: e.target.value })}
                    >
                      <option value="1">Year 1 (Freshman)</option>
                      <option value="2">Year 2 (Sophomore)</option>
                      <option value="3">Year 3 (Junior)</option>
                      <option value="4">Year 4 (Senior)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Current Semester</label>
                    <select
                      value={studentForm.semester}
                      onChange={e => setStudentForm({ ...studentForm, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowStudentModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STUDENT COMPREHENSIVE PROFILE */}
      {showProfileModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content wide" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-banner">
              <div className="profile-modal-avatar">
                {selectedStudent.fullName ? selectedStudent.fullName.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="profile-modal-info">
                <h2>{selectedStudent.fullName}</h2>
                <div className="profile-meta-row">
                  <span><strong>Roll No:</strong> {selectedStudent.rollNumber}</span>
                  <span>•</span>
                  <span><strong>Dept:</strong> {selectedStudent.departmentCode || selectedStudent.departmentName || selectedStudent.department?.name || 'CSE'}</span>
                  <span>•</span>
                  <span><strong>Year:</strong> Year {selectedStudent.yearOfStudy} (Sem {selectedStudent.semester})</span>
                </div>
              </div>
              <button
                className="icon-button"
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white', border: 0 }}
                onClick={() => setShowProfileModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item">
                <small>Email Address</small>
                <strong>{selectedStudent.email}</strong>
              </div>
              <div className="detail-item">
                <small>Phone Number</small>
                <strong>{selectedStudent.phone || 'Not provided'}</strong>
              </div>
              <div className="detail-item">
                <small>Gender</small>
                <strong>{selectedStudent.gender || 'Other'}</strong>
              </div>
            </div>

            <div style={{ padding: '24px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ font: '800 17px Manrope', margin: 0 }}>Academic Examination Records</h3>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openAddRecord(selectedStudent)}>
                  <Plus size={14} /> Add Grade
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Semester</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>CGPA</th>
                      <th>Attendance</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentRecords.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.subject}</strong></td>
                        <td>Sem {r.semester}</td>
                        <td>{r.marksObtained} / {r.maxMarks}</td>
                        <td>
                          <span className={`grade-badge grade-${(r.grade || 'A').toLowerCase().replace('+', 'plus')}`}>
                            {r.grade || 'A'}
                          </span>
                        </td>
                        <td><strong>{r.cgpa || '8.5'}</strong></td>
                        <td><span className="badge badge-emerald">{r.attendance ? `${r.attendance}%` : '90%'}</span></td>
                        <td><small style={{ color: 'var(--muted)' }}>{r.remarks || '—'}</small></td>
                      </tr>
                    ))}
                    {!studentRecords.length && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                          No academic records recorded yet for this student. Click "+ Add Grade" to record marks.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => openEditStudent(selectedStudent)}>
                <Pencil size={14} /> Edit Profile
              </button>
              <button className="btn-primary" onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DEPARTMENT */}
      {showDeptModal && (
        <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{editingDept ? 'Edit Department' : 'Create Department'}</h3>
                <p>Define department code and description for organizational structure.</p>
              </div>
              <button className="icon-button" onClick={() => setShowDeptModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={saveDepartment}>
              <div className="modal-form">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Department Code * (e.g. CSE, IT, ECE)</label>
                  <input
                    required
                    placeholder="e.g. CSE"
                    value={deptForm.code}
                    onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Department Name *</label>
                  <input
                    required
                    placeholder="e.g. Computer Science & Engineering"
                    value={deptForm.name}
                    onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Key topics, laboratories, and specializations..."
                    value={deptForm.description}
                    onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowDeptModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ACADEMIC RECORD */}
      {showRecordModal && (
        <div className="modal-overlay" onClick={() => setShowRecordModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{editingRecord ? 'Edit Academic Record' : 'Record Course Examination'}</h3>
                <p>Grades and CGPA calculations are calculated automatically based on scores.</p>
              </div>
              <button className="icon-button" onClick={() => setShowRecordModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={saveRecord}>
              <div className="modal-form">
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Select Student *</label>
                    <select
                      required
                      value={recordForm.studentId}
                      onChange={e => setRecordForm({ ...recordForm, studentId: e.target.value })}
                    >
                      <option value="">Choose Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          [{s.rollNumber}] {s.fullName} ({s.departmentCode || s.departmentName || 'Dept'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group col-span-2">
                    <label>Subject / Course Name *</label>
                    <input
                      required
                      placeholder="e.g. Operating Systems, Data Structures, etc."
                      value={recordForm.subject}
                      onChange={e => setRecordForm({ ...recordForm, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      value={recordForm.semester}
                      onChange={e => setRecordForm({ ...recordForm, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Academic Year</label>
                    <input
                      value={recordForm.academicYear}
                      onChange={e => setRecordForm({ ...recordForm, academicYear: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Marks Obtained *</label>
                    <input
                      required
                      type="number"
                      step="0.5"
                      min="0"
                      value={recordForm.marksObtained}
                      onChange={e => setRecordForm({ ...recordForm, marksObtained: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Maximum Marks *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={recordForm.maxMarks}
                      onChange={e => setRecordForm({ ...recordForm, maxMarks: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Attendance Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={recordForm.attendance}
                      onChange={e => setRecordForm({ ...recordForm, attendance: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Remarks / Feedback</label>
                    <input
                      placeholder="e.g. Excellent laboratory work"
                      value={recordForm.remarks}
                      onChange={e => setRecordForm({ ...recordForm, remarks: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowRecordModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Examination Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER ACCOUNT */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Create Authorized User</h3>
                <p>Register new administrative or faculty credentials.</p>
              </div>
              <button className="icon-button" onClick={() => setShowUserModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={saveUser}>
              <div className="modal-form">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Username *</label>
                  <input
                    required
                    placeholder="e.g. prof_john"
                    value={userForm.username}
                    onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Password *</label>
                  <input
                    required
                    type="password"
                    placeholder="Choose password"
                    value={userForm.password}
                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Prof. John Doe"
                    value={userForm.fullName}
                    onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="user@studenthub.edu"
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Account Role *</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="ADMIN">Administrator (Full Access)</option>
                    <option value="FACULTY">Faculty Member (Academic Manager)</option>
                    <option value="STUDENT">Student (Profile Viewer)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOGIN / ROLE SELECTOR */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-card" onClick={e => e.stopPropagation()}>
            <div className="login-header">
              <div className="login-logo">
                <GraduationCap size={28} />
              </div>
              <h2>Sign in to StudentHub</h2>
              <p>Academic Database & Student Management Portal</p>
            </div>

            {/* Quick Demo Credentials Picker */}
            <div className="quick-roles">
              <span>Quick Test Credentials:</span>
              <div className="quick-roles-grid">
                <button
                  type="button"
                  className={`btn-role-quick ${loginForm.username === 'admin' ? 'active' : ''}`}
                  onClick={() => pickDemoRole('ADMIN')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`btn-role-quick ${loginForm.username === 'faculty' ? 'active' : ''}`}
                  onClick={() => pickDemoRole('FACULTY')}
                >
                  Faculty
                </button>
                <button
                  type="button"
                  className={`btn-role-quick ${loginForm.username === 'student' ? 'active' : ''}`}
                  onClick={() => pickDemoRole('STUDENT')}
                >
                  Student
                </button>
              </div>
            </div>

            {loginError && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Username or Email</label>
                <input
                  required
                  placeholder="e.g. admin or admin@studenthub.edu"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 0, color: '#94a3b8' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
                disabled={loginLoading}
              >
                {loginLoading ? 'Authenticating...' : 'Sign In'}
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '10px' }}
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);