import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizzes, getQuizProgress, saveQuizProgress, clearQuizProgress, getCurrentUser, saveResults } from '../../utils/storage';
import { evaluateQuiz } from '../../utils/evaluation';
import Timer from '../../components/Timer';
import QuestionCard from '../../components/QuestionCard';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const user = getCurrentUser();

  const quiz = useMemo(() => getQuizzes().find((q) => q.id === quizId), [quizId]);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timerStopped, setTimerStopped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quiz) { setLoading(false); return; }
    const progress = getQuizProgress();
    const saved = progress[quizId];
    if (saved) {
      setAnswers(saved.answers || {});
      setMarkedForReview(saved.markedForReview || {});
      if (saved.currentIndex !== undefined) setCurrentIndex(saved.currentIndex);
    }
    setLoading(false);
  }, [quiz, quizId]);

  const saveProgress = useCallback(() => {
    if (!quiz) return;
    const progress = getQuizProgress();
    progress[quizId] = { answers, markedForReview, currentIndex, answeredCount: Object.keys(answers).length, startedAt: progress[quizId]?.startedAt || Date.now() };
    saveQuizProgress(progress);
  }, [quiz, quizId, answers, markedForReview, currentIndex]);

  useEffect(() => { if (quiz && !loading) saveProgress(); }, [answers, markedForReview, currentIndex, quiz, loading, saveProgress]);

  const handleSelectAnswer = (option) => {
    const q = quiz.questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  };

  const handleMarkReview = () => {
    const q = quiz.questions[currentIndex];
    setMarkedForReview((prev) => { const next = { ...prev }; if (next[q.id]) delete next[q.id]; else next[q.id] = true; return next; });
  };

  const handleSubmit = useCallback(() => {
    if (!quiz) return;
    setTimerStopped(true);
    const result = evaluateQuiz(quiz, answers);
    const progress = getQuizProgress();
    const startedAt = progress[quizId]?.startedAt || Date.now();
    const timeTaken = Math.round((Date.now() - startedAt) / 1000);
    const resultId = `result_${Date.now()}`;
    const resultRecord = { id: resultId, studentId: user.id, studentName: user.name, quizId: quiz.id, quizTitle: quiz.title, ...result, timeTaken, date: new Date().toISOString() };
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    results.push(resultRecord);
    saveResults(results);
    clearQuizProgress(quizId);
    toast.success('Quiz submitted successfully!');
    navigate(`/student/result/${resultId}`);
  }, [quiz, answers, user, quizId, navigate, toast]);

  const handleTimeExpire = useCallback(() => {
    toast.warning('Time is up! Submitting your quiz automatically.');
    handleSubmit();
  }, [handleSubmit, toast]);

  if (loading) return <div className="page"><div className="loading-container"><div className="loading-spinner" /><p className="loading-message">Loading quiz...</p></div></div>;
  if (!quiz) return <div className="page"><div className="error-state"><h2>Quiz Not Found</h2><p className="text-muted">The quiz you're looking for doesn't exist.</p><button className="btn btn-primary mt-4" onClick={() => navigate('/student/quizzes')}>Back to Quizzes</button></div></div>;
  if (!quiz.published) return <div className="page"><div className="error-state"><h2>Quiz Unavailable</h2><p className="text-muted">This quiz is not currently published.</p><button className="btn btn-primary mt-4" onClick={() => navigate('/student/quizzes')}>Back to Quizzes</button></div></div>;
  if (quiz.questions.length === 0) return <div className="page"><div className="error-state"><h2>No Questions</h2><p className="text-muted">This quiz doesn't have any questions yet.</p><button className="btn btn-primary mt-4" onClick={() => navigate('/student/quizzes')}>Back to Quizzes</button></div></div>;

  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.keys(markedForReview).length;
  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <div className="quiz-header-left">
          <h1 className="quiz-header-title">{quiz.title}</h1>
          <p className="quiz-header-meta">Question {currentIndex + 1} of {quiz.questions.length}</p>
        </div>
        <Timer duration={quiz.duration} onExpire={handleTimeExpire} stopped={timerStopped} />
      </header>
      <div className="quiz-progress-bar">
        <div className="progress-label">
          <span>Progress</span>
          <span>Question {currentIndex + 1} / {quiz.questions.length} {'\u2022'} {Math.round(progressPercent)}%</span>
        </div>
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} /></div>
      </div>
      <div className="quiz-layout">
        <div className="quiz-main">
          <QuestionCard question={currentQuestion} index={currentIndex} selectedAnswer={answers[currentQuestion.id]} onSelect={handleSelectAnswer} onMarkReview={handleMarkReview} isMarked={!!markedForReview[currentQuestion.id]} />
          <div className="quiz-nav-buttons">
            <button className="btn btn-secondary" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>{'\u2190'} Previous</button>
            {currentIndex < quiz.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentIndex(currentIndex + 1)}>Next {'\u2192'}</button>
            ) : (
              <button className="btn btn-success" onClick={() => setShowSubmitModal(true)}>Submit Quiz {'\u2713'}</button>
            )}
          </div>
        </div>
        <aside className="quiz-palette">
          <h3 className="palette-title">Question Palette</h3>
          <div className="palette-grid">
            {quiz.questions.map((q, i) => {
              const isAnswered = !!answers[q.id];
              const isMarked = !!markedForReview[q.id];
              const isCurrent = i === currentIndex;
              return (
                <button key={q.id} className={`palette-item ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : 'unanswered'} ${isMarked ? 'marked' : ''}`} onClick={() => setCurrentIndex(i)}>{i + 1}</button>
              );
            })}
          </div>
          <div className="palette-legend">
            <div className="legend-item"><span className="legend-dot answered" /><span>Answered ({answeredCount})</span></div>
            <div className="legend-item"><span className="legend-dot unanswered" /><span>Unanswered ({quiz.questions.length - answeredCount})</span></div>
            <div className="legend-item"><span className="legend-dot marked" /><span>Marked ({markedCount})</span></div>
            <div className="legend-item"><span className="legend-dot current" /><span>Current</span></div>
          </div>
          <button className="btn btn-success w-full mt-4" onClick={() => setShowSubmitModal(true)}>Submit Quiz</button>
        </aside>
      </div>
      <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Quiz?">
        <div className="submit-modal-content">
          <p>You have answered:</p>
          <div className="submit-modal-stats">
            <div className="submit-stat-item"><span className="submit-stat-label">Answered</span><span className="submit-stat-value answered">{answeredCount}</span></div>
            <div className="submit-stat-item"><span className="submit-stat-label">Unanswered</span><span className="submit-stat-value unanswered">{quiz.questions.length - answeredCount}</span></div>
            <div className="submit-stat-item"><span className="submit-stat-label">Marked for Review</span><span className="submit-stat-value marked">{markedCount}</span></div>
          </div>
          <div className="submit-modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>Continue Quiz</button>
            <button className="btn btn-success" onClick={handleSubmit}>Submit Quiz</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
