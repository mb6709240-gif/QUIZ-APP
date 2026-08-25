import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes, saveQuizzes, getResults } from '../../utils/storage';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';

export default function ManageQuizzes() {
  const navigate = useNavigate();
  const toast = useToast();
  const [quizzes, setQuizzes] = useState(getQuizzes());
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const results = getResults();

  const subjects = useMemo(() => {
    const set = new Set(quizzes.map((q) => q.subject));
    return ['All', ...Array.from(set)];
  }, [quizzes]);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase());
      const matchSubject = subjectFilter === 'All' || q.subject === subjectFilter;
      const matchDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const matchStatus = statusFilter === 'All' || (statusFilter === 'Published' && q.published) || (statusFilter === 'Unpublished' && !q.published);
      return matchSearch && matchSubject && matchDifficulty && matchStatus;
    });
  }, [quizzes, search, subjectFilter, difficultyFilter, statusFilter]);

  const handlePublish = (quiz) => {
    const updated = quizzes.map((q) => q.id === quiz.id ? { ...q, published: !q.published } : q);
    setQuizzes(updated); saveQuizzes(updated);
    toast.success(`Quiz ${quiz.published ? 'unpublished' : 'published'} successfully`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = quizzes.filter((q) => q.id !== deleteTarget.id);
    setQuizzes(updated); saveQuizzes(updated);
    toast.success('Quiz deleted successfully');
    setDeleteTarget(null);
  };

  const getAttempts = (quizId) => results.filter((r) => r.quizId === quizId).length;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">All Quizzes</h1>
            <p className="page-subtitle">Manage your quiz collection</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>+ Create Quiz</button>
        </div>
      </div>
      <div className="quiz-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">{'\uD83D\uDD0D'}</span>
          <input type="text" className="quiz-search-input" placeholder="Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="quiz-filters">
          <select className="form-select quiz-filter-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            {subjects.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
          </select>
          <select className="form-select quiz-filter-select" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="All">All Difficulty</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
          </select>
          <select className="form-select quiz-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option><option value="Published">Published</option><option value="Unpublished">Unpublished</option>
          </select>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Quiz</th><th>Subject</th><th>Questions</th><th>Duration</th><th>Status</th><th>Attempts</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((quiz) => (
                <tr key={quiz.id}>
                  <td><div className="table-quiz-info"><span className="font-semibold">{quiz.title}</span><span className="text-muted" style={{ fontSize: '0.8rem' }}>{quiz.difficulty}</span></div></td>
                  <td><span className="badge badge-primary">{quiz.subject}</span></td>
                  <td>{quiz.questions?.length || 0}</td>
                  <td>{quiz.duration} min</td>
                  <td><span className={`badge ${quiz.published ? 'badge-success' : 'badge-neutral'}`}>{quiz.published ? 'Published' : 'Draft'}</span></td>
                  <td>{getAttempts(quiz.id)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit" title="Edit" onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}>{'\u270F\uFE0F'}</button>
                      <button className="action-btn questions" title="Questions" onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}>{'\u2753'}</button>
                      <button className="action-btn publish" title={quiz.published ? 'Unpublish' : 'Publish'} onClick={() => handlePublish(quiz)}>{quiz.published ? '\uD83D\uDD12' : '\uD83D\uDCE1'}</button>
                      <button className="action-btn delete" title="Delete" onClick={() => setDeleteTarget(quiz)}>{'\uD83D\uDDD1\uFE0F'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="\uD83D\uDCC5" title="No quizzes found" message={quizzes.length === 0 ? "Create your first quiz to get started." : "No quizzes match your filters."}
          action={quizzes.length === 0 ? <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>+ Create Quiz</button> : <button className="btn btn-secondary" onClick={() => { setSearch(''); setSubjectFilter('All'); setDifficultyFilter('All'); setStatusFilter('All'); }}>Clear Filters</button>} />
      )}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Quiz?">
        <p className="delete-modal-text">Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.</p>
        <div className="delete-modal-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete Quiz</button>
        </div>
      </Modal>
    </div>
  );
}
