import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getQuizzes, getResults, getQuizProgress } from '../../utils/storage';

export default function StudentDashboard() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const quizzes = getQuizzes().filter((q) => q.published);
  const allResults = getResults().filter((r) => r.studentId === user?.id);
  const progress = getQuizProgress();
  const now = new Date();

  const stats = useMemo(() => {
    const completed = allResults.length;
    const avgScore = completed > 0 ? Math.round(allResults.reduce((s, r) => s + r.percentage, 0) / completed) : 0;
    const bestScore = completed > 0 ? Math.max(...allResults.map((r) => r.percentage)) : 0;
    return { available: quizzes.length, completed, avgScore, bestScore };
  }, [allResults, quizzes]);

  const unfinishedQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const p = progress[q.id];
      return p && p.answeredCount > 0 && p.answeredCount < (q.questions?.length || 0);
    }).slice(0, 3);
  }, [quizzes, progress]);

  const upcomingQuizzes = useMemo(() => {
    return quizzes.filter((q) => q.scheduledEnabled && q.scheduledAt && new Date(q.scheduledAt) > now).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  }, [quizzes, now]);

  const recentResults = useMemo(() => {
    return [...allResults].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  }, [allResults]);

  const recommendedQuizzes = useMemo(() => {
    const attemptedIds = new Set(allResults.map((r) => r.quizId));
    const unattempted = quizzes.filter((q) => !attemptedIds.has(q.id));
    return (unattempted.length > 0 ? unattempted : quizzes).slice(0, 4);
  }, [quizzes, allResults]);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const today = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const weekData = [72, 81, 90, 76, 88, 92, 85];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const formatScheduledDate = (dateStr) => {
    const d = new Date(dateStr);
    const diff = d - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''} ${hours > 0 ? `& ${hours}h` : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `In ${mins} minute${mins > 1 ? 's' : ''}`;
  };

  const statCards = [
    { icon: '\uD83D\uDCDA', label: 'Available Quizzes', value: stats.available, gradient: 'gradient-primary', sub: 'Ready to attempt' },
    { icon: '\u2705', label: 'Completed', value: stats.completed, gradient: 'gradient-success', sub: 'Quizzes taken' },
    { icon: '\uD83D\uDCCA', label: 'Average Score', value: `${stats.avgScore}%`, gradient: 'gradient-warning', sub: 'Across all quizzes' },
    { icon: '\uD83C\uDFC6', label: 'Best Score', value: `${stats.bestScore}%`, gradient: 'gradient-danger', sub: 'Highest achievement' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0]} {'\uD83D\uDC4B'}</h1>
        <p className="page-subtitle">{today}</p>
      </div>
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={stat.label} className="stat-card card card-hover" style={{ animationDelay: `${i * 80}ms`, animation: 'fadeInUp 0.5s ease backwards' }}>
            <div className={`stat-card-decoration ${stat.gradient}`} />
            <div className="stat-card-content">
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
              <div className="stat-card-sub">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {upcomingQuizzes.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">{'\uD83D\uDCC5'} Upcoming Quizzes</h2>
          </div>
          <div className="upcoming-quiz-grid">
            {upcomingQuizzes.map((quiz) => (
              <div key={quiz.id} className="upcoming-quiz-card card card-hover">
                <div className="upcoming-quiz-top">
                  <span className="badge badge-primary">{quiz.subject}</span>
                  <span className={`badge ${quiz.difficulty === 'Easy' ? 'badge-success' : quiz.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>{quiz.difficulty}</span>
                </div>
                <h3 className="upcoming-quiz-title">{quiz.title}</h3>
                <p className="upcoming-quiz-desc">{quiz.description}</p>
                <div className="upcoming-quiz-meta">
                  <span>{'\u2753'} {quiz.questions?.length || 0} Questions</span>
                  <span>{'\uD83C\uDFC6'} {quiz.totalMarks} Marks</span>
                  <span>{'\u23F1\uFE0F'} {quiz.duration} Min</span>
                </div>
                <div className="upcoming-quiz-date">
                  <span className="upcoming-quiz-opens">Opens {new Date(quiz.scheduledAt).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="upcoming-quiz-countdown">{formatScheduledDate(quiz.scheduledAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {unfinishedQuizzes.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">Continue Learning</h2>
          <div className="continue-learning-grid">
            {unfinishedQuizzes.map((quiz) => {
              const p = progress[quiz.id];
              const total = quiz.questions?.length || 0;
              const percent = total > 0 ? Math.round((p.answeredCount / total) * 100) : 0;
              return (
                <div key={quiz.id} className="continue-card card">
                  <h3 className="continue-title">{quiz.title}</h3>
                  <p className="continue-meta">{p.answeredCount} / {total} Questions Completed</p>
                  <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${percent}%` }} /></div>
                  <button className="btn btn-primary btn-sm mt-4" onClick={() => navigate(`/student/quiz/${quiz.id}`)}>Continue Quiz</button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recommended Quizzes</h2>
          <Link to="/student/quizzes" className="section-link">View All {'\u2192'}</Link>
        </div>
        <div className="quiz-grid">
          {recommendedQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card card card-hover">
              <div className="quiz-card-header">
                <span className="badge badge-primary">{quiz.subject}</span>
                <span className={`badge ${quiz.difficulty === 'Easy' ? 'badge-success' : quiz.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>{quiz.difficulty}</span>
              </div>
              <h3 className="quiz-card-title">{quiz.title}</h3>
              <p className="quiz-card-desc">{quiz.description}</p>
              <div className="quiz-card-meta">
                <span>{'\uD83D\uDCDD'} {quiz.questions?.length || 0} Q</span>
                <span>{'\uD83C\uDFC6'} {quiz.totalMarks} Marks</span>
                <span>{'\u23F1\uFE0F'} {quiz.duration} Min</span>
              </div>
              <button className="btn btn-primary w-full quiz-card-btn" onClick={() => navigate(`/student/quiz/${quiz.id}`)}>Start Quiz</button>
            </div>
          ))}
        </div>
      </section>

      <div className="dashboard-bottom-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Previous Results</h2>
            <Link to="/student/results" className="section-link">View All {'\u2192'}</Link>
          </div>
          {recentResults.length > 0 ? (
            <div className="recent-results-list">
              {recentResults.map((result) => (
                <div key={result.id} className="recent-result-item card card-hover" onClick={() => navigate(`/student/result/${result.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="recent-result-info">
                    <h4 className="recent-result-title">{result.quizTitle}</h4>
                    <p className="recent-result-date">{new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="recent-result-score">
                    <span className="recent-result-percent">{result.percentage}%</span>
                    <span className={`badge ${result.status === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>{result.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (<div className="empty-state-mini"><p className="text-muted">No results yet. Take a quiz to see your scores!</p></div>)}
        </section>
        <section className="dashboard-section">
          <h2 className="section-title">Performance Overview</h2>
          <div className="chart-card card">
            <div className="bar-chart">
              {weekData.map((val, i) => (
                <div key={i} className="bar-chart-item">
                  <div className="bar-chart-bar-wrapper">
                    <span className="bar-chart-value">{val}</span>
                    <div className="bar-chart-bar" style={{ height: `${val}%`, animation: `barGrow 0.6s ease ${i * 80}ms backwards` }} />
                  </div>
                  <span className="bar-chart-label">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
