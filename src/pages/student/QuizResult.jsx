import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResults, getQuizzes } from '../../utils/storage';
import { useToast } from '../../components/Toast';

export default function QuizResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [showDetailed, setShowDetailed] = useState(false);

  const result = useMemo(() => getResults().find((r) => r.id === resultId), [resultId]);
  const quiz = useMemo(() => result ? getQuizzes().find((q) => q.id === result.quizId) : null, [result]);

  if (!result) {
    return <div className="page"><div className="error-state"><h2>Result Not Found</h2><p className="text-muted">The result you're looking for doesn't exist.</p><button className="btn btn-primary mt-4" onClick={() => navigate('/student/results')}>Back to Results</button></div></div>;
  }

  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (result.percentage / 100) * circumference;
  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;

  const handleRetake = () => {
    if (!quiz) { toast.error('Quiz not available for retake'); return; }
    navigate(`/student/quiz/${quiz.id}`);
  };

  return (
    <div className="page">
      <div className="result-hero card">
        <div className="result-hero-bg" />
        <div className="result-hero-content">
          <span className="result-hero-emoji">{'\uD83C\uDF89'}</span>
          <h1 className="result-hero-title">Quiz Completed</h1>
          <p className="result-hero-quiz">{result.quizTitle}</p>
          <div className="circular-progress-wrapper">
            <svg className="circular-progress" viewBox="0 0 280 280">
              <circle className="circular-progress-bg" cx="140" cy="140" r="120" fill="none" strokeWidth="16" />
              <circle className="circular-progress-fill" cx="140" cy="140" r="120" fill="none" strokeWidth="16" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 140 140)" />
            </svg>
            <div className="circular-progress-content">
              <span className="circular-score">{result.percentage}%</span>
              <span className="circular-marks">{result.obtainedMarks} / {result.totalMarks}</span>
            </div>
          </div>
          <div className="result-hero-badges">
            <div className="result-badge"><span className="result-badge-label">GRADE</span><span className="result-badge-value">{result.grade}</span></div>
            <div className={`result-badge ${result.status === 'PASSED' ? 'passed' : 'failed'}`}><span className="result-badge-label">STATUS</span><span className="result-badge-value">{result.status}</span></div>
          </div>
        </div>
      </div>
      <div className="result-stats-grid">
        <div className="result-stat-card card"><span className="result-stat-icon correct">{'\u2713'}</span><span className="result-stat-value">{result.correct}</span><span className="result-stat-label">Correct</span></div>
        <div className="result-stat-card card"><span className="result-stat-icon wrong">{'\u2715'}</span><span className="result-stat-value">{result.wrong}</span><span className="result-stat-label">Wrong</span></div>
        <div className="result-stat-card card"><span className="result-stat-icon skipped">{'\u25CB'}</span><span className="result-stat-value">{result.unanswered}</span><span className="result-stat-label">Unanswered</span></div>
        <div className="result-stat-card card"><span className="result-stat-icon time">{'\u23F1\uFE0F'}</span><span className="result-stat-value">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span><span className="result-stat-label">Time Taken</span></div>
      </div>
      <div className="result-actions">
        <button className="btn btn-primary" onClick={() => setShowDetailed(!showDetailed)}>{showDetailed ? 'Hide Details' : 'View Detailed Result'}</button>
        <Link to="/student/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        <button className="btn btn-success" onClick={handleRetake}>Retake Quiz</button>
      </div>
      {showDetailed && quiz && (
        <div className="detailed-results">
          <h2 className="section-title">Detailed Results</h2>
          {quiz.questions.map((question, i) => {
            const userAnswer = result.answers?.[question.id] || null;
            const isCorrect = userAnswer === question.correctAnswer;
            const isUnanswered = !userAnswer;
            return (
              <div key={question.id} className={`detail-question-card card ${isUnanswered ? 'unanswered' : isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="detail-question-header">
                  <span className="detail-question-number">Question {i + 1}</span>
                  {isUnanswered ? <span className="badge badge-neutral">Not Answered</span> : isCorrect ? <span className="badge badge-success">{'\u2713'} Correct</span> : <span className="badge badge-danger">{'\u2715'} Incorrect</span>}
                </div>
                <p className="detail-question-text">{question.text}</p>
                {isUnanswered ? (
                  <div className="detail-answer-row"><span className="detail-answer-label">Not Answered</span></div>
                ) : (
                  <div className="detail-answer-row"><span className="detail-answer-label">Your Answer:</span><p className={`detail-answer-value ${isCorrect ? 'correct' : 'wrong'}`}>{userAnswer}</p></div>
                )}
                <div className="detail-answer-row"><span className="detail-answer-label">Correct Answer:</span><p className="detail-answer-value correct">{question.correctAnswer}</p></div>
                <div className="detail-marks"><span className="badge badge-neutral">{isCorrect ? `+${question.marks} Marks` : '0 Marks'}</span></div>
                {question.explanation && (
                  <div className="detail-explanation"><span className="detail-explanation-label">Explanation:</span><p className="detail-explanation-text">{question.explanation}</p></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
