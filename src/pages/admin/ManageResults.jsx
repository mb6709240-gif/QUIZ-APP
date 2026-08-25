import { useState, useMemo } from 'react';
import { getResults } from '../../utils/storage';
import EmptyState from '../../components/EmptyState';

export default function ManageResults() {
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const results = getResults();

  const quizOptions = useMemo(() => {
    const set = new Set(results.map((r) => r.quizTitle));
    return ['All', ...Array.from(set)];
  }, [results]);

  const filtered = useMemo(() => {
    let list = results.filter((r) => {
      const matchSearch = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.quizTitle.toLowerCase().includes(search.toLowerCase());
      const matchQuiz = quizFilter === 'All' || r.quizTitle === quizFilter;
      const matchGrade = gradeFilter === 'All' || r.grade === gradeFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchQuiz && matchGrade && matchStatus;
    });
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'score-desc': return b.percentage - a.percentage;
        case 'score-asc': return a.percentage - b.percentage;
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        default: return 0;
      }
    });
    return list;
  }, [results, search, quizFilter, gradeFilter, statusFilter, sortBy]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Results</h1>
        <p className="page-subtitle">View and analyze student performance across all quizzes</p>
      </div>
      <div className="results-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">{'\uD83D\uDD0D'}</span>
          <input type="text" className="quiz-search-input" placeholder="Search by student or quiz..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="results-filters">
          <select className="form-select quiz-filter-select" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
            {quizOptions.map((q) => <option key={q} value={q}>{q === 'All' ? 'All Quizzes' : q}</option>)}
          </select>
          <select className="form-select quiz-filter-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="All">All Grades</option><option value="A+">A+</option><option value="A">A</option><option value="B+">B+</option><option value="B">B</option><option value="C">C</option><option value="F">F</option>
          </select>
          <select className="form-select quiz-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option><option value="PASSED">Passed</option><option value="FAILED">Failed</option>
          </select>
          <select className="form-select quiz-filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option><option value="date-asc">Oldest First</option><option value="score-desc">Highest Score</option><option value="score-asc">Lowest Score</option>
          </select>
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Student</th><th>Quiz</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.map((result) => (
                <tr key={result.id}>
                  <td className="font-semibold">{result.studentName}</td>
                  <td>{result.quizTitle}</td>
                  <td>{result.obtainedMarks}/{result.totalMarks}</td>
                  <td><span className={result.percentage >= 80 ? 'text-success' : result.percentage >= 50 ? 'text-warning' : 'text-danger'}>{result.percentage}%</span></td>
                  <td><span className={`badge ${result.grade === 'A+' || result.grade === 'A' ? 'badge-success' : result.grade === 'F' ? 'badge-danger' : 'badge-primary'}`}>{result.grade}</span></td>
                  <td><span className={`badge ${result.status === 'PASSED' ? 'badge-success' : 'badge-danger'}`}>{result.status}</span></td>
                  <td className="text-muted">{new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="\uD83D\uDCCA" title="No results found" message="No results match your filters. Try adjusting your search."
          action={<button className="btn btn-secondary" onClick={() => { setSearch(''); setQuizFilter('All'); setGradeFilter('All'); setStatusFilter('All'); setSortBy('date-desc'); }}>Clear Filters</button>} />
      )}
    </div>
  );
}
