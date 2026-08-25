import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, getQuizzes, getResults } from '../../utils/storage';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const users = getUsers().filter((u) => u.role === 'student');
    const quizzes = getQuizzes();
    const results = getResults();
    const totalQuestions = quizzes.reduce((s, q) => s + (q.questions?.length || 0), 0);
    const avgScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
    const passRate = results.length > 0 ? Math.round((results.filter((r) => r.status === 'PASSED').length / results.length) * 100) : 0;
    return { totalStudents: users.length, totalQuizzes: quizzes.length, totalQuestions, totalAttempts: results.length, avgScore, passRate };
  }, []);

  const recentActivity = useMemo(() => {
    const results = getResults();
    return [...results].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((r) => ({
      text: `${r.studentName} completed ${r.quizTitle}`,
      time: getRelativeTime(r.date),
    }));
  }, []);

  const quickActions = [
    { icon: '\uD83D\uDCDD', label: 'Create New Quiz', action: () => navigate('/admin/quizzes/create') },
    { icon: '\u2753', label: 'Add Question', action: () => navigate('/admin/quizzes') },
    { icon: '\uD83D\uDC65', label: 'View Students', action: () => navigate('/admin/students') },
    { icon: '\uD83C\uDFC6', label: 'View Results', action: () => navigate('/admin/results') },
  ];

  const statCards = [
    { icon: '\uD83D\uDC65', label: 'Total Students', value: stats.totalStudents, gradient: 'gradient-primary' },
    { icon: '\uD83D\uDCDD', label: 'Total Quizzes', value: stats.totalQuizzes, gradient: 'gradient-success' },
    { icon: '\u2753', label: 'Total Questions', value: stats.totalQuestions, gradient: 'gradient-warning' },
    { icon: '\uD83D\uDCCA', label: 'Total Attempts', value: stats.totalAttempts, gradient: 'gradient-danger' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of your QuizFlow platform</p>
      </div>
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={stat.label} className="stat-card card card-hover" style={{ animationDelay: `${i * 80}ms`, animation: 'fadeInUp 0.5s ease backwards' }}>
            <div className={`stat-card-decoration ${stat.gradient}`} />
            <div className="stat-card-content">
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="secondary-stats-grid">
        <div className="secondary-stat-card card">
          <div className="secondary-stat-icon">{'\uD83D\uDCCA'}</div>
          <div><span className="secondary-stat-value">{stats.avgScore}%</span><span className="secondary-stat-label">Average Score</span></div>
        </div>
        <div className="secondary-stat-card card">
          <div className="secondary-stat-icon">{'\u2705'}</div>
          <div><span className="secondary-stat-value">{stats.passRate}%</span><span className="secondary-stat-label">Pass Rate</span></div>
        </div>
      </div>
      <section className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button key={action.label} className="quick-action-card card card-hover" onClick={action.action}>
              <span className="quick-action-icon">{action.icon}</span>
              <span className="quick-action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <Link to="/admin/results" className="section-link">View All {'\u2192'}</Link>
        </div>
        <div className="activity-list card">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))
          ) : (<p className="text-muted text-center" style={{ padding: '2rem' }}>No recent activity</p>)}
        </div>
      </section>
    </div>
  );
}

function getRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}
