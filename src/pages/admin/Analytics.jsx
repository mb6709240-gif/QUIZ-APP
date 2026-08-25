import { useMemo } from 'react';
import { getResults, getQuizzes } from '../../utils/storage';

export default function Analytics() {
  const results = getResults();
  const quizzes = getQuizzes();

  const analytics = useMemo(() => {
    const totalAttempts = results.length;
    const avgScore = totalAttempts > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalAttempts) : 0;
    const passed = results.filter((r) => r.status === 'PASSED').length;
    const failed = results.filter((r) => r.status === 'FAILED').length;
    const passPercentage = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0;
    const failPercentage = totalAttempts > 0 ? Math.round((failed / totalAttempts) * 100) : 0;
    const highestScore = totalAttempts > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;
    const lowestScore = totalAttempts > 0 ? Math.min(...results.map((r) => r.percentage)) : 0;
    return { totalAttempts, avgScore, passPercentage, failPercentage, highestScore, lowestScore };
  }, [results]);

  const distribution = useMemo(() => {
    const ranges = [
      { label: '0-49%', min: 0, max: 49, count: 0 },
      { label: '50-59%', min: 50, max: 59, count: 0 },
      { label: '60-69%', min: 60, max: 69, count: 0 },
      { label: '70-79%', min: 70, max: 79, count: 0 },
      { label: '80-89%', min: 80, max: 89, count: 0 },
      { label: '90-100%', min: 90, max: 100, count: 0 },
    ];
    results.forEach((r) => { const range = ranges.find((d) => r.percentage >= d.min && r.percentage <= d.max); if (range) range.count++; });
    const maxCount = Math.max(...ranges.map((r) => r.count), 1);
    return { ranges, maxCount };
  }, [results]);

  const quizPerformance = useMemo(() => {
    return quizzes.map((quiz) => {
      const quizResults = results.filter((r) => r.quizId === quiz.id);
      const attempts = quizResults.length;
      const avg = attempts > 0 ? Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / attempts) : 0;
      const highest = attempts > 0 ? Math.max(...quizResults.map((r) => r.percentage)) : 0;
      const lowest = attempts > 0 ? Math.min(...quizResults.map((r) => r.percentage)) : 0;
      const passRate = attempts > 0 ? Math.round((quizResults.filter((r) => r.status === 'PASSED').length / attempts) * 100) : 0;
      return { quiz, attempts, avg, highest, lowest, passRate };
    }).filter((qp) => qp.attempts > 0);
  }, [quizzes, results]);

  const statCards = [
    { icon: '\uD83D\uDCCA', label: 'Total Attempts', value: analytics.totalAttempts, gradient: 'gradient-primary' },
    { icon: '\uD83D\uDCC8', label: 'Average Score', value: `${analytics.avgScore}%`, gradient: 'gradient-success' },
    { icon: '\u2705', label: 'Pass Percentage', value: `${analytics.passPercentage}%`, gradient: 'gradient-success' },
    { icon: '\u274C', label: 'Fail Percentage', value: `${analytics.failPercentage}%`, gradient: 'gradient-danger' },
    { icon: '\uD83C\uDFC6', label: 'Highest Score', value: `${analytics.highestScore}%`, gradient: 'gradient-warning' },
    { icon: '\uD83D\uDCC9', label: 'Lowest Score', value: `${analytics.lowestScore}%`, gradient: 'gradient-danger' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Insights into quiz performance and student engagement</p>
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
      <section className="dashboard-section">
        <h2 className="section-title">Score Distribution</h2>
        <div className="chart-card card">
          <div className="distribution-chart">
            {distribution.ranges.map((range, i) => (
              <div key={i} className="distribution-bar-item">
                <div className="distribution-bar-wrapper">
                  <span className="distribution-bar-count">{range.count}</span>
                  <div className="distribution-bar" style={{ height: `${(range.count / distribution.maxCount) * 100}%`, animation: `barGrow 0.6s ease ${i * 80}ms backwards` }} />
                </div>
                <span className="distribution-bar-label">{range.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="dashboard-section">
        <h2 className="section-title">Quiz Performance</h2>
        {quizPerformance.length > 0 ? (
          <div className="quiz-performance-grid">
            {quizPerformance.map((qp) => (
              <div key={qp.quiz.id} className="quiz-performance-card card">
                <h3 className="qp-title">{qp.quiz.title}</h3>
                <div className="qp-stats">
                  <div className="qp-stat"><span className="qp-stat-label">Attempts</span><span className="qp-stat-value">{qp.attempts}</span></div>
                  <div className="qp-stat"><span className="qp-stat-label">Average</span><span className="qp-stat-value text-primary">{qp.avg}%</span></div>
                  <div className="qp-stat"><span className="qp-stat-label">Highest</span><span className="qp-stat-value text-success">{qp.highest}%</span></div>
                  <div className="qp-stat"><span className="qp-stat-label">Lowest</span><span className="qp-stat-value text-danger">{qp.lowest}%</span></div>
                  <div className="qp-stat"><span className="qp-stat-label">Pass Rate</span><span className="qp-stat-value text-success">{qp.passRate}%</span></div>
                </div>
                <div className="progress-bar mt-4"><div className="progress-bar-fill" style={{ width: `${qp.avg}%` }} /></div>
              </div>
            ))}
          </div>
        ) : (<div className="empty-state-mini card"><p className="text-muted">No quiz performance data available yet.</p></div>)}
      </section>
    </div>
  );
}
