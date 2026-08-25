import { useState, useMemo } from 'react';
import { getResults, saveResults } from '../../utils/storage';
import { getGrade, getStatus } from '../../utils/grading';
import { useToast } from '../../components/Toast';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

export default function ManageResults() {
  const toast = useToast();
  const [results, setResults] = useState(getResults());
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editForm, setEditForm] = useState({ obtainedMarks: 0, totalMarks: 0, passingPercentage: 50 });

  const quizOptions = useMemo(() => {
    const set = new Set(results.map((r) => r.quizTitle));
    return ['All', ...Array.from(set)];
  }, [results]);

  const filtered = useMemo(() => {
    let list = results.filter((r) => {
      const matchSearch = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.quizTitle.toLowerCase().includes(search.toLowerCase());
      const matchQuiz = quizFilter === 'All' || r.quizTitle === quizFilter;
      const matchGrade = gradeFilter === 'All' || r.grade === gradeFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchQuiz && matchGrade && matchStatus;
    });
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'score-desc': return b.percentage - a.percentage;
        case 'score-asc': return a.percentage - b.percentage;
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        default: return 0;
      }
    });
    return list;
  }, [results, search, quizFilter, gradeFilter, statusFilter, sortBy]);

  const openEdit = (result) => {
    setEditTarget(result);
    setEditForm({ obtainedMarks: result.obtainedMarks, totalMarks: result.totalMarks, passingPercentage: result.passingPercentage || 50 });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const obtained = parseInt(editForm.obtainedMarks);
    const total = parseInt(editForm.totalMarks);
    if (isNaN(obtained) || isNaN(total) || total <= 0) { toast.error('Please enter valid marks'); return; }
    if (obtained < 0 || obtained > total) { toast.error('Obtained marks must be between 0 and total marks'); return; }
    const percentage = Math.round((obtained / total) * 100);
    const grade = getGrade(percentage);
    const status = getStatus(percentage, parseInt(editForm.passingPercentage));
    const updated = results.map((r) => r.id === editTarget.id ? { ...r, obtainedMarks: obtained, totalMarks: total, percentage, grade, status, passingPercentage: parseInt(editForm.passingPercentage) } : r);
    setResults(updated); saveResults(updated);
    toast.success('Result updated successfully');
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = results.filter((r) => r.id !== deleteTarget.id);
    setResults(updated); saveResults(updated);
    toast.success('Result deleted successfully');
    setDeleteTarget(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Results</h1>
        <p className="page-subtitle">View, edit, and analyze student performance across all quizzes</p>
      </div>
      <div className="results-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">{'\uD83D\uDD0D'}</span>
          <input type="text" className="quiz-search-input" placeholder="Search by student or quiz..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="results-filters">
          <select className="form-select quiz-filter-select" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
            {quizOptions.map((q) => <option key={q} value={q}>{q === 'All' ? 'All Quizzes' : q}</option>)}
          </select>
          <select className="form-select quiz-filter-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="All">All Grades</option><option value="A+">A+</option><option value="A">A</option><option value="B+">B+</option><option value="B">B</option><option value="C">C</option><option value="F">F</option>
          </select>
          <select className="form-select quiz-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option><option value="PASSED">Passed</option><option value="FAILED">Failed</option>
          </select>
          <select className="form-select quiz-filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option><option value="date-asc">Oldest First</option><option value="score-desc">Highest Score</option><option value="score-asc">Lowest Score</option>
          </select>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Student</th><th>Quiz</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((result) => (
                <tr key={result.id}>
                  <td className="font-semibold">{result.studentName}</td>
                  <td>{result.quizTitle}</td>
                  <td>{result.obtainedMarks}/{result.totalMarks}</td>
                  <td><span className={result.percentage >= 80 ? 'text-success' : result.percentage >= 50 ? 'text-warning' : 'text-danger'}>{result.percentage}%</span></td>
                  <td><span className={`badge ${result.grade === 'A+' || result.grade === 'A' ? 'badge-success' : result.grade === 'F' ? 'badge-danger' : 'badge-primary'}`}>{result.grade}</span></td>
                  <td><span className={`badge ${result.status === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>{result.status}</span></td>
                  <td className="text-muted">{new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" title="Edit" onClick={() => openEdit(result)}>{'\u270F\uFE0F'}</button>
                      <button className="action-btn" title="Delete" onClick={() => setDeleteTarget(result)}>{'\uD83D\uDDD1\uFE0F'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="\uD83D\uDCCA" title="No results found" message="No results match your filters. Try adjusting your search."
          action={<button className="btn btn-secondary" onClick={() => { setSearch(''); setQuizFilter('All'); setGradeFilter('All'); setStatusFilter('All'); setSortBy('date-desc'); }}>Clear Filters</button>} />
      )}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Student Result">
        {editTarget && (
          <form onSubmit={handleSaveEdit}>
            <div className="result-edit-info" style={{ marginBottom: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
              <p style={{ fontWeight: 600 }}>{editTarget.studentName}</p>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{editTarget.quizTitle}</p>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Obtained Marks</label>
                <input type="number" className="form-input" min="0" value={editForm.obtainedMarks} onChange={(e) => setEditForm({ ...editForm, obtainedMarks: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Marks</label>
                <input type="number" className="form-input" min="1" value={editForm.totalMarks} onChange={(e) => setEditForm({ ...editForm, totalMarks: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Passing Percentage</label>
              <input type="number" className="form-input" min="1" max="100" value={editForm.passingPercentage} onChange={(e) => setEditForm({ ...editForm, passingPercentage: e.target.value })} />
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <span>Preview: </span>
              <span className="font-bold">
                {editForm.totalMarks > 0 ? Math.round((parseInt(editForm.obtainedMarks || 0) / parseInt(editForm.totalMarks)) * 100) : 0}%
                {' '}({getGrade(editForm.totalMarks > 0 ? Math.round((parseInt(editForm.obtainedMarks || 0) / parseInt(editForm.totalMarks)) * 100) : 0)})
                {' '}{getStatus(editForm.totalMarks > 0 ? Math.round((parseInt(editForm.obtainedMarks || 0) / parseInt(editForm.totalMarks)) * 100) : 0, parseInt(editForm.passingPercentage) || 50)}
              </span>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setEditTarget(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Result?">
        <p className="delete-modal-text">Are you sure you want to delete this result for <strong>{deleteTarget?.studentName}</strong>? This cannot be undone.</p>
        <div className="delete-modal-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete Result</button>
        </div>
      </Modal>
    </div>
  );
}
