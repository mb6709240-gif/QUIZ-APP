import { useState, useMemo } from 'react';
import { getUsers, getResults } from '../../utils/storage';
import EmptyState from '../../components/EmptyState';

export default function ManageStudents() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const students = useMemo(() => getUsers().filter((u) => u.role === 'student'), []);
  const results = getResults();

  const studentStats = useMemo(() => {
    return students.map((student) => {
      const studentResults = results.filter((r) => r.studentId === student.id);
      const attempts = studentResults.length;
      const avgScore = attempts > 0 ? Math.round(studentResults.reduce((s, r) => s + r.percentage, 0) / attempts) : 0;
      const bestScore = attempts > 0 ? Math.max(...studentResults.map((r) => r.percentage)) : 0;
      const status = attempts > 0 ? 'Active' : 'Inactive';
      return { ...student, attempts, avgScore, bestScore, status };
    });
  }, [students, results]);

  const filtered = useMemo(() => {
    return studentStats.filter((s) => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [studentStats, search, statusFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Students</h1>
        <p className="page-subtitle">Manage and monitor student accounts</p>
      </div>
      <div className="quiz-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">{'\uD83D\uDD0D'}</span>
          <input type="text" className="quiz-search-input" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select quiz-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Students</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
        </select>
      </div>
      {filtered.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Attempts</th><th>Average Score</th><th>Best Score</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td><div className="student-info-cell"><div className="student-avatar-sm">{student.name.charAt(0).toUpperCase()}</div><span className="font-semibold">{student.name}</span></div></td>
                  <td className="text-muted">{student.email}</td>
                  <td>{student.attempts}</td>
                  <td><span className={student.avgScore >= 80 ? 'text-success' : student.avgScore >= 50 ? 'text-warning' : 'text-danger'}>{student.avgScore}%</span></td>
                  <td><span className={student.bestScore >= 80 ? 'text-success' : ''}>{student.bestScore}%</span></td>
                  <td><span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{student.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="\uD83D\uDC65" title="No students found" message={students.length === 0 ? "No students have registered yet." : "No students match your search."}
          action={students.length > 0 ? <button className="btn btn-secondary" onClick={() => { setSearch(''); setStatusFilter('All'); }}>Clear Filters</button> : null} />
      )}
    </div>
  );
}
