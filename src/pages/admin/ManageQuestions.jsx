import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzes, saveQuizzes } from '../../utils/storage';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import { getOpenDate, getCloseDate } from '../../utils/scheduling';

const toLocalInput = (date) => {
  if (!date) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function ManageQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [quizzes, setQuizzes] = useState(getQuizzes());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showEditQuiz, setShowEditQuiz] = useState(false);

  const quiz = useMemo(() => quizzes.find((q) => q.id === quizId), [quizzes, quizId]);

  const [questionForm, setQuestionForm] = useState({ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 2, explanation: '' });
  const [quizForm, setQuizForm] = useState(quiz ? {
    title: quiz.title, description: quiz.description, subject: quiz.subject, difficulty: quiz.difficulty, duration: quiz.duration,
    passingPercentage: quiz.passingPercentage, published: quiz.published, scheduledEnabled: quiz.scheduledEnabled || !!quiz.scheduledAt,
    openAt: toLocalInput(getOpenDate(quiz)), closeAt: toLocalInput(getCloseDate(quiz)),
  } : {});

  if (!quiz) {
    return <div className="page"><div className="error-state"><h2>Quiz Not Found</h2><p className="text-muted">This quiz doesn't exist.</p><button className="btn btn-primary mt-4" onClick={() => navigate('/admin/quizzes')}>Back to Quizzes</button></div></div>;
  }

  const updateQuizState = (newQuizzes) => { setQuizzes(newQuizzes); saveQuizzes(newQuizzes); };
  const resetQuestionForm = () => { setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 2, explanation: '' }); setEditingId(null); };

  const handleAddOrUpdateQuestion = (e) => {
    e.preventDefault();
    if (!questionForm.text.trim()) { toast.error('Question text is required'); return; }
    if (questionForm.options.some((o) => !o.trim())) { toast.error('All options must be filled'); return; }
    if (!questionForm.correctAnswer) { toast.error('Please select the correct answer'); return; }

    const updated = quizzes.map((q) => {
      if (q.id !== quizId) return q;
      let questions = [...(q.questions || [])];
      if (editingId) {
        const idx = questions.findIndex((qq) => qq.id === editingId);
        if (idx >= 0) questions[idx] = { ...questions[idx], text: questionForm.text.trim(), options: questionForm.options.map((o) => o.trim()), correctAnswer: questionForm.correctAnswer, marks: parseInt(questionForm.marks), explanation: questionForm.explanation.trim() };
      } else {
        questions.push({ id: `q_${Date.now()}`, text: questionForm.text.trim(), options: questionForm.options.map((o) => o.trim()), correctAnswer: questionForm.correctAnswer, marks: parseInt(questionForm.marks), explanation: questionForm.explanation.trim() });
      }
      const totalMarks = questions.reduce((s, qq) => s + (qq.marks || 2), 0);
      return { ...q, questions, totalMarks };
    });
    updateQuizState(updated);
    toast.success(editingId ? 'Question updated successfully' : 'Question added successfully');
    resetQuestionForm();
    setShowAddForm(false);
  };

  const handleEditQuestion = (question) => {
    setQuestionForm({ text: question.text, options: [...question.options], correctAnswer: question.correctAnswer, marks: question.marks, explanation: question.explanation || '' });
    setEditingId(question.id);
    setShowAddForm(true);
  };

  const handleDeleteQuestion = () => {
    if (!deleteTarget) return;
    const updated = quizzes.map((q) => {
      if (q.id !== quizId) return q;
      const questions = (q.questions || []).filter((qq) => qq.id !== deleteTarget.id);
      const totalMarks = questions.reduce((s, qq) => s + (qq.marks || 2), 0);
      return { ...q, questions, totalMarks };
    });
    updateQuizState(updated);
    toast.success('Question deleted successfully');
    setDeleteTarget(null);
  };

  const handleMove = (index, direction) => {
    const updated = quizzes.map((q) => {
      if (q.id !== quizId) return q;
      const questions = [...(q.questions || [])];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= questions.length) return q;
      [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
      return { ...q, questions };
    });
    updateQuizState(updated);
  };

  const handleSaveQuizEdit = (e) => {
    e.preventDefault();
    const updated = quizzes.map((q) => {
      if (q.id !== quizId) return q;
      const open = quizForm.scheduledEnabled && quizForm.openAt ? new Date(quizForm.openAt) : null;
      const close = quizForm.scheduledEnabled && quizForm.closeAt ? new Date(quizForm.closeAt) : null;
      return {
        ...q, title: quizForm.title.trim(), description: quizForm.description.trim(), subject: quizForm.subject.trim(),
        difficulty: quizForm.difficulty, duration: parseInt(quizForm.duration), passingPercentage: parseInt(quizForm.passingPercentage),
        published: quizForm.published, scheduledEnabled: quizForm.scheduledEnabled,
        openDate: open ? quizForm.openAt.slice(0, 10) : null, openTime: open ? quizForm.openAt.slice(11, 16) : null,
        closeDate: close ? quizForm.closeAt.slice(0, 10) : null, closeTime: close ? quizForm.closeAt.slice(11, 16) : null,
        scheduledAt: open ? open.toISOString() : null,
      };
    });
    updateQuizState(updated);
    toast.success('Quiz updated successfully');
    setShowEditQuiz(false);
  };

  const handlePublishToggle = () => {
    const updated = quizzes.map((q) => q.id === quizId ? { ...q, published: !q.published } : q);
    updateQuizState(updated);
    toast.success(`Quiz ${quiz.published ? 'unpublished' : 'published'} successfully`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <button className="back-link" onClick={() => navigate('/admin/quizzes')}>{'\u2190'} Back to Quizzes</button>
            <h1 className="page-title">{quiz.title}</h1>
            <p className="page-subtitle">{quiz.description}</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary" onClick={() => setShowEditQuiz(true)}>{'\u270F\uFE0F'} Edit Quiz</button>
            <button className={`btn ${quiz.published ? 'btn-danger' : 'btn-success'}`} onClick={handlePublishToggle}>{quiz.published ? '\uD83D\uDD12 Unpublish' : '\uD83D\uDCE1 Publish'}</button>
          </div>
        </div>
      </div>
      <div className="quiz-info-bar">
        <div className="quiz-info-item"><span className="quiz-info-icon">{'\uD83D\uDCDA'}</span><span>{quiz.subject}</span></div>
        <div className="quiz-info-item"><span className="quiz-info-icon">{'\uD83D\uDCCA'}</span><span>{quiz.difficulty}</span></div>
        <div className="quiz-info-item"><span className="quiz-info-icon">{'\u2753'}</span><span>{quiz.questions?.length || 0} Questions</span></div>
        <div className="quiz-info-item"><span className="quiz-info-icon">{'\uD83C\uDFC6'}</span><span>{quiz.totalMarks} Marks</span></div>
        <div className="quiz-info-item"><span className="quiz-info-icon">{'\u23F1\uFE0F'}</span><span>{quiz.duration} Minutes</span></div>
        <div className="quiz-info-item"><span className="quiz-info-icon">{'\u2705'}</span><span>Pass: {quiz.passingPercentage}%</span></div>
        {getOpenDate(quiz) && (
          <div className="quiz-info-item"><span className="quiz-info-icon">{'\uD83D\uDCC5'}</span><span>Opens: {getOpenDate(quiz).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
        )}
      </div>
      <div className="questions-section">
        <div className="section-header">
          <h2 className="section-title">Questions ({quiz.questions?.length || 0})</h2>
          <button className="btn btn-primary" onClick={() => { resetQuestionForm(); setShowAddForm(true); }}>+ Add Question</button>
        </div>
        {quiz.questions && quiz.questions.length > 0 ? (
          <div className="questions-list">
            {quiz.questions.map((question, i) => (
              <div key={question.id} className="question-manage-card card">
                <div className="question-manage-header">
                  <span className="question-manage-number">Question {i + 1}</span>
                  <span className="badge badge-neutral">{question.marks} marks</span>
                </div>
                <p className="question-manage-text">{question.text}</p>
                <div className="question-manage-options">
                  {question.options.map((opt, j) => (
                    <div key={j} className={`question-manage-option ${opt === question.correctAnswer ? 'correct' : ''}`}>
                      <span className="option-letter">{String.fromCharCode(65 + j)}</span>
                      <span>{opt}</span>
                      {opt === question.correctAnswer && <span className="correct-mark">{'\u2713'}</span>}
                    </div>
                  ))}
                </div>
                {question.explanation && <p className="question-manage-explanation"><strong>Explanation:</strong> {question.explanation}</p>}
                <div className="question-manage-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEditQuestion(question)}>{'\u270F\uFE0F'} Edit</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMove(i, -1)} disabled={i === 0}>{'\u2191'} Move Up</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMove(i, 1)} disabled={i === quiz.questions.length - 1}>{'\u2193'} Move Down</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(question)}>{'\uD83D\uDDD1\uFE0F'} Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="\u2753" title="No questions yet" message="Add your first question to this quiz."
            action={<button className="btn btn-primary" onClick={() => { resetQuestionForm(); setShowAddForm(true); }}>+ Add Question</button>} />
        )}
      </div>
      <Modal open={showAddForm} onClose={() => { setShowAddForm(false); resetQuestionForm(); }} title={editingId ? 'Edit Question' : 'Add Question'}>
        <form onSubmit={handleAddOrUpdateQuestion} className="question-form">
          <div className="form-group">
            <label className="form-label">Question</label>
            <textarea className="form-textarea" rows="3" placeholder="Enter the question..." value={questionForm.text} onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Options</label>
            {questionForm.options.map((opt, i) => (
              <div key={i} className="option-input-row">
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <input type="text" className="form-input" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={(e) => { const newOptions = [...questionForm.options]; newOptions[i] = e.target.value; setQuestionForm({ ...questionForm, options: newOptions }); }} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Correct Answer</label>
            <select className="form-select" value={questionForm.correctAnswer} onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}>
              <option value="">Select correct answer...</option>
              {questionForm.options.map((opt, i) => (opt.trim() && <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Marks</label>
            <input type="number" className="form-input" min="1" value={questionForm.marks} onChange={(e) => setQuestionForm({ ...questionForm, marks: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Explanation (optional)</label>
            <textarea className="form-textarea" rows="2" placeholder="Explain the correct answer..." value={questionForm.explanation} onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => { setShowAddForm(false); resetQuestionForm(); }}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update Question' : 'Add Question'}</button>
          </div>
        </form>
      </Modal>
      <Modal open={showEditQuiz} onClose={() => setShowEditQuiz(false)} title="Edit Quiz">
        <form onSubmit={handleSaveQuizEdit} className="question-form">
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input type="text" className="form-input" value={quizForm.title || ''} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows="2" value={quizForm.description || ''} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={quizForm.subject || ''} onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={quizForm.difficulty || 'Easy'} onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input type="number" className="form-input" min="1" value={quizForm.duration || 30} onChange={(e) => setQuizForm({ ...quizForm, duration: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Passing %</label>
              <input type="number" className="form-input" min="1" max="100" value={quizForm.passingPercentage || 50} onChange={(e) => setQuizForm({ ...quizForm, passingPercentage: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="toggle-label-row"><span>Published</span>
              <label className="toggle"><input type="checkbox" checked={quizForm.published || false} onChange={(e) => setQuizForm({ ...quizForm, published: e.target.checked })} /><span className="toggle-slider" /></label>
            </label>
          </div>
          <div className="form-group">
            <label className="toggle-label-row">
              <div>
                <span className="settings-toggle-label">Schedule Open Time</span>
                <p className="settings-toggle-desc">When this quiz becomes available to students</p>
              </div>
              <label className="toggle"><input type="checkbox" checked={quizForm.scheduledEnabled || false} onChange={(e) => setQuizForm({ ...quizForm, scheduledEnabled: e.target.checked })} /><span className="toggle-slider" /></label>
            </label>
          </div>
          {quizForm.scheduledEnabled && (
            <div className="form-group">
              <label className="form-label">Open Date & Time</label>
              <input type="datetime-local" className="form-input" value={quizForm.openAt || ''} onChange={(e) => setQuizForm({ ...quizForm, openAt: e.target.value })} />
              <label className="form-label mt-2">Close Date & Time</label>
              <input type="datetime-local" className="form-input" value={quizForm.closeAt || ''} onChange={(e) => setQuizForm({ ...quizForm, closeAt: e.target.value })} />
            </div>
          )}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowEditQuiz(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Question?">
        <p className="delete-modal-text">Are you sure you want to delete this question? This cannot be undone.</p>
        <div className="delete-modal-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDeleteQuestion}>Delete Question</button>
        </div>
      </Modal>
    </div>
  );
}
