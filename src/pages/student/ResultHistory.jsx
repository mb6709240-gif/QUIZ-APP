import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getResults, getCurrentUser } from '../../utils/storage';
import EmptyState from '../../components/EmptyState';

export default function ResultHistory() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const results = useMemo(() => {
    return getResults().filter((r) => r.studentId === user?.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [user]);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const matchSearch = !search || r.quizTitle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [results, search, statusFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Results</h1>
        <p className="page-subtitle">View your quiz history and performance</p>
      </div>
      <div className="quiz-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">{'\uD83D\uDD0D'}</span>
          <input type="text" className="quiz-search-input" placeholder="Search by quiz name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select quiz-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="PASSED">Passed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>
      {filtered.length > 0 ? (
        <>
          <div className="table-wrapper hide-mobile">
            <table className="table">
              <thead>
                <tr><th>Quiz</th><th>Date</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((result) => (
                  <tr key={result.id}>
                    <td className="font-semibold">{result.quizTitle}</td>
                    <td className="text-muted">{new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>{result.obtainedMarks}/{result.totalMarks}</td>
                    <td><span className={result.percentage >= 80 ? 'text-success' : result.percentage >= 50 ? 'text-warning' : 'text-danger'}>{result.percentage}%</span></td>
                    <td><span className={`badge ${result.grade === 'A+' || result.grade === 'A' ? 'badge-success' : result.grade === 'F' ? 'badge-danger' : 'badge-primary'}`}>{result.grade}</span></td>
                    <td><span className={`badge ${result.status === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>{result.status}</span></td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => navigate(`/student/result/${result.id}`)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="show-mobile-only">
            <div className="result-cards-mobile">
              {filtered.map((result) => (
                <div key={result.id} className="result-card-mobile card" onClick={() => navigate(`/student/result/${result.id}`)}>
                  <div className="result-card-mobile-header">
                    <h4>{result.quizTitle}</h4>
                    <span className={`badge ${result.status === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>{result.status}</span>
                  </div>
                  <div className="result-card-mobile-meta">
                    <span>{new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>{result.obtainedMarks}/{result.totalMarks}</span>
                    <span className={result.percentage >= 80 ? 'text-success' : result.percentage >= 50 ? 'text-warning' : 'text-danger'}>{result.percentage}%</span>
                    <span className={`badge ${result.grade === 'A+' || result.grade === 'A' ? 'badge-success' : result.grade === 'F' ? 'badge-danger' : 'badge-primary'}`}>{result.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyState icon="\uD83D\uDCCA" title="No results found" message={results.length === 0 ? "You haven't taken any quizzes yet." : "No results match your search."}
          action={results.length === 0 ? <Link to="/student/quizzes" className="btn btn-primary">Browse Quizzes</Link> : <button className="btn btn-secondary" onClick={() => { setSearch(''); setStatusFilter('All'); }}>Clear Filters</button>} />
      )}
    </div>
  );
}
