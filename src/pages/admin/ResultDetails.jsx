import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, getResults, saveResults } from '../../utils/storage';
import { getGrade, getStatus } from '../../utils/grading';
import { getQuizzes } from '../../utils/storage';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

export default function ResultDetails() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [results, setResults] = useState(getResults());
  const result = useMemo(() => results.find((item) => item.id === resultId), [results, resultId]);
  const quiz = useMemo(() => result && getQuizzes().find((item) => item.id === result.quizId), [result]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  if (!result) return <div className="page"><div className="error-state"><h2>Result Not Found</h2><p className="text-muted">This result may have been deleted.</p><button className="btn btn-primary mt-4" onClick={() => navigate('/admin/results')}>Back to Results</button></div></div>;

  const openEdit = () => {
    setForm({ obtainedMarks: result.obtainedMarks, totalMarks: result.totalMarks, passingPercentage: result.passingPercentage || 50, correct: result.correct ?? result.correctAnswers ?? 0, wrong: result.wrong ?? result.wrongAnswers ?? 0, unanswered: result.unanswered ?? 0, adminNote: result.adminNote || '' });
    setEditing(true);
  };
  const saveEdit = (event) => {
    event.preventDefault();
    const obtainedMarks = Number(form.obtainedMarks);
    const totalMarks = Number(form.totalMarks);
    const passingPercentage = Number(form.passingPercentage);
    if (!Number.isFinite(obtainedMarks) || !Number.isFinite(totalMarks) || totalMarks <= 0 || obtainedMarks < 0 || obtainedMarks > totalMarks || passingPercentage < 0 || passingPercentage > 100) {
      toast.error('Enter valid result values');
      return;
    }
    const percentage = Math.round((obtainedMarks / totalMarks) * 100);
    const updated = results.map((item) => item.id === result.id ? {
      ...item, obtainedMarks, totalMarks, percentage, grade: getGrade(percentage), status: getStatus(percentage, passingPercentage),
      passingPercentage, correct: Number(form.correct) || 0, wrong: Number(form.wrong) || 0, unanswered: Number(form.unanswered) || 0,
      correctAnswers: Number(form.correct) || 0, wrongAnswers: Number(form.wrong) || 0, adminNote: form.adminNote.trim(),
      lastModifiedBy: getCurrentUser()?.email || 'admin@quiz.com', lastModifiedAt: new Date().toISOString(),
    } : item);
    setResults(updated); saveResults(updated); setEditing(false); toast.success('Result updated successfully');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-link" onClick={() => navigate('/admin/results')}>← Back to Results</button>
        <h1 className="page-title">Student Result</h1>
        <p className="page-subtitle">Review and adjust this submitted attempt</p>
      </div>
      <div className="result-hero card">
        <div className="result-hero-content">
          <span className="result-hero-emoji">🏆</span>
          <h2 className="result-hero-title">{result.quizTitle}</h2>
          <p className="result-hero-quiz">{result.studentName} · {result.studentEmail || 'Email unavailable'}</p>
          <div className="circular-progress-wrapper">
            <svg className="circular-progress" viewBox="0 0 280 280"><circle className="circular-progress-bg" cx="140" cy="140" r="120" fill="none" strokeWidth="16" /><circle className="circular-progress-fill" cx="140" cy="140" r="120" fill="none" strokeWidth="16" strokeDasharray={2 * Math.PI * 120} strokeDashoffset={2 * Math.PI * 120 - (result.percentage / 100) * 2 * Math.PI * 120} strokeLinecap="round" transform="rotate(-90 140 140)" /></svg>
            <div className="circular-progress-content"><span className="circular-score">{result.percentage}%</span><span className="circular-marks">{result.obtainedMarks} / {result.totalMarks}</span></div>
          </div>
          <div className="result-hero-badges"><div className="result-badge"><span className="result-badge-label">GRADE</span><span className="result-badge-value">{result.grade}</span></div><div className={`result-badge ${result.status === 'PASSED' ? 'passed' : 'failed'}`}><span className="result-badge-label">STATUS</span><span className="result-badge-value">{result.status}</span></div></div>
        </div>
      </div>
      <div className="result-stats-grid">
        <div className="result-stat-card card"><span className="result-stat-value">{result.correct ?? result.correctAnswers ?? 0}</span><span className="result-stat-label">Correct</span></div>
        <div className="result-stat-card card"><span className="result-stat-value">{result.wrong ?? result.wrongAnswers ?? 0}</span><span className="result-stat-label">Wrong</span></div>
        <div className="result-stat-card card"><span className="result-stat-value">{result.unanswered ?? 0}</span><span className="result-stat-label">Unanswered</span></div>
        <div className="result-stat-card card"><span className="result-stat-value">{new Date(result.date || result.submittedAt).toLocaleDateString()}</span><span className="result-stat-label">Submitted</span></div>
      </div>
      <div className="result-actions"><button className="btn btn-primary" onClick={openEdit}>✏️ Edit Result</button><button className="btn btn-secondary" onClick={() => navigate('/admin/results')}>Back to Results</button></div>
      {(result.adminNote || result.lastModifiedAt) && <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}><h3 className="section-title">Audit</h3>{result.adminNote && <p>{result.adminNote}</p>}{result.lastModifiedAt && <p className="text-muted mt-2">Last modified by {result.lastModifiedBy} on {new Date(result.lastModifiedAt).toLocaleString()}</p>}</div>}
      {quiz && result.answers && <div><h2 className="section-title">Submitted Answers</h2>{quiz.questions.map((question, index) => <div className="detail-question-card card" key={question.id}><span className="detail-question-number">Question {index + 1}</span><p className="detail-question-text">{question.text}</p><p className={result.answers[question.id] === question.correctAnswer ? 'text-success' : 'text-danger'}>{result.answers[question.id] || 'Not answered'}</p><p className="text-muted">Correct answer: {question.correctAnswer}</p></div>)}</div>}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Student Result">
        {form && <form onSubmit={saveEdit}><div className="form-row"><div className="form-group"><label className="form-label">Obtained Marks</label><input className="form-input" type="number" min="0" value={form.obtainedMarks} onChange={(e) => setForm({ ...form, obtainedMarks: e.target.value })} /></div><div className="form-group"><label className="form-label">Total Marks</label><input className="form-input" type="number" min="1" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} /></div></div><div className="form-row"><div className="form-group"><label className="form-label">Correct Answers</label><input className="form-input" type="number" min="0" value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })} /></div><div className="form-group"><label className="form-label">Wrong Answers</label><input className="form-input" type="number" min="0" value={form.wrong} onChange={(e) => setForm({ ...form, wrong: e.target.value })} /></div><div className="form-group"><label className="form-label">Unanswered</label><input className="form-input" type="number" min="0" value={form.unanswered} onChange={(e) => setForm({ ...form, unanswered: e.target.value })} /></div></div><div className="form-group"><label className="form-label">Passing Percentage</label><input className="form-input" type="number" min="0" max="100" value={form.passingPercentage} onChange={(e) => setForm({ ...form, passingPercentage: e.target.value })} /></div><div className="form-group"><label className="form-label">Admin Note</label><textarea className="form-textarea" rows="3" value={form.adminNote} onChange={(e) => setForm({ ...form, adminNote: e.target.value })} /></div><div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button><button className="btn btn-primary">Save Changes</button></div></form>}
      </Modal>
    </div>
  );
}