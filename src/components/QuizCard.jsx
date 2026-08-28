import { getQuizStatus, getOpenDate, getCloseDate } from '../utils/scheduling';

export default function QuizCard({ quiz, progress, onStart }) {
  const answeredCount = progress?.answeredCount || 0;
  const totalQuestions = quiz.questions?.length || 0;
  const hasProgress = answeredCount > 0 && answeredCount < totalQuestions;
  const percent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const diffBadge = { Easy: 'badge-success', Medium: 'badge-warning', Hard: 'badge-danger' };
  const status = getQuizStatus(quiz);
  const statusClass = { UPCOMING: 'badge-warning', LIVE: 'badge-success', COMPLETED: 'badge-neutral', DRAFT: 'badge-neutral' }[status];
  const openDate = getOpenDate(quiz);
  const closeDate = getCloseDate(quiz);
  const disabled = totalQuestions === 0;

  return (
    <div className="quiz-card card card-hover">
      <div className="quiz-card-header">
        <span className="badge badge-primary">{quiz.subject}</span>
        <span className={`badge ${diffBadge[quiz.difficulty] || 'badge-neutral'}`}>{quiz.difficulty}</span>
      </div>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">{quiz.description}</p>
      <div className="quiz-card-meta">
        <span className="quiz-meta-item">{'\uD83D\uDCDD'} {totalQuestions} Questions</span>
        <span className="quiz-meta-item">{'\uD83C\uDFC6'} {quiz.totalMarks} Marks</span>
        <span className="quiz-meta-item">{'\u23F1\uFE0F'} {quiz.duration} Min</span>
      </div>
      <div className="quiz-card-passing">Passing: {quiz.passingPercentage}%</div>
      <div className="quiz-card-passing">
        <span className={`badge ${statusClass}`}>{status}</span>
        {status === 'UPCOMING' && openDate && ` Opens ${openDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`}
        {status === 'COMPLETED' && closeDate && ` Closed ${closeDate.toLocaleDateString()}`}
      </div>
      {hasProgress && (
        <div className="quiz-card-progress">
          <div className="progress-label">
            <span>{answeredCount} / {totalQuestions} Completed</span>
            <span className="progress-percent">{percent}%</span>
          </div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${percent}%` }} /></div>
        </div>
      )}
      <button className={`btn ${disabled ? 'btn-secondary' : 'btn-primary'} w-full quiz-card-btn`} onClick={() => onStart(quiz)} disabled={disabled}>
        {totalQuestions === 0 ? 'No Questions' : status === 'UPCOMING' ? 'View Details' : status === 'COMPLETED' ? 'View Details' : hasProgress ? 'Continue Quiz' : 'Start Quiz'}
      </button>
    </div>
  );
}
