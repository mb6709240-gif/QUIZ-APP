import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes, saveQuizzes } from '../../utils/storage';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';

export default function AllQuestions() {
  const navigate = useNavigate();
  const toast = useToast();
  const [quizzes, setQuizzes] = useState(getQuizzes());
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const questions = useMemo(() => quizzes.flatMap((quiz) => (quiz.questions || []).map((question, index) => ({ ...question, quiz, index })))
    .filter((item) => {
      const haystack = `${item.text} ${item.quiz.title} ${item.quiz.subject}`.toLowerCase();
      return !search || haystack.includes(search.toLowerCase());
    }), [quizzes, search]);

  const save = (next) => { setQuizzes(next); saveQuizzes(next); };
  const handleDelete = () => {
    if (!deleteTarget) return;
    save(quizzes.map((quiz) => quiz.id === deleteTarget.quiz.id
      ? { ...quiz, questions: quiz.questions.filter((question) => question.id !== deleteTarget.id), totalMarks: quiz.questions.filter((question) => question.id !== deleteTarget.id).reduce((sum, question) => sum + (question.marks || 2), 0) }
      : quiz));
    toast.success('Question deleted successfully');
    setDeleteTarget(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Question Bank</h1>
        <p className="page-subtitle">Review every question across your quizzes</p>
      </div>
      <div className="quiz-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">🔍</span>
          <input className="quiz-search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions, quizzes, or subjects..." aria-label="Search questions" />
        </div>
      </div>
      {questions.length ? (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Quiz</th><th>Question</th><th>Marks</th><th>Correct Answer</th><th>Actions</th></tr></thead>
            <tbody>{questions.map((item) => (
              <tr key={`${item.quiz.id}-${item.id}`}>
                <td><span className="font-semibold">{item.quiz.title}</span><br /><span className="text-muted">{item.quiz.subject}</span></td>
                <td>{item.text}</td>
                <td>{item.marks || 2}</td>
                <td><span className="text-success">{item.correctAnswer}</span></td>
                <td><div className="table-actions">
                  <button className="action-btn" title="Manage quiz questions" onClick={() => navigate(`/admin/quizzes/${item.quiz.id}`)}>Edit</button>
                  <button className="action-btn" title="Delete question" onClick={() => setDeleteTarget(item)}>🗑️</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <EmptyState icon="❓" title="No questions found" message={search ? 'Try a different search.' : 'Add questions from a quiz to build your question bank.'} />}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Question?">
        <p className="delete-modal-text">Delete this question from <strong>{deleteTarget?.quiz.title}</strong>?</p>
        <div className="delete-modal-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete Question</button>
        </div>
      </Modal>
    </div>
  );
}