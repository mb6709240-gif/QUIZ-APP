import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes, getQuizProgress } from '../../utils/storage';
import QuizCard from '../../components/QuizCard';
import EmptyState from '../../components/EmptyState';
import { getQuizStatus } from '../../utils/scheduling';

export default function QuizList({ filter }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusView, setStatusView] = useState(filter || 'ALL');
  const [now, setNow] = useState(() => new Date());
  const quizzes = getQuizzes().filter((q) => q.published);
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = getQuizProgress();

  const subjects = useMemo(() => {
    const set = new Set(quizzes.map((q) => q.subject));
    return ['All', ...Array.from(set)];
  }, [quizzes]);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase());
      const matchSubject = subjectFilter === 'All' || q.subject === subjectFilter;
      const matchDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const matchStatus = statusView === 'ALL' || getQuizStatus(q, now) === statusView;
      return matchSearch && matchSubject && matchDifficulty && matchStatus;
    });
  }, [quizzes, search, subjectFilter, difficultyFilter, statusView, now]);

  const clearFilters = () => { setSearch(''); setSubjectFilter('All'); setDifficultyFilter('All'); };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Available Quizzes</h1>
        <p className="page-subtitle">Browse and attempt quizzes to test your knowledge</p>
      </div>
      <div className="quiz-toolbar">
        <div className="quiz-search">
          <span className="quiz-search-icon">{'\uD83D\uDD0D'}</span>
          <input type="text" className="quiz-search-input" placeholder="Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="quiz-filters">
          <select className="form-select quiz-filter-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            {subjects.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
          </select>
          <select className="form-select quiz-filter-select" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      {!filter && (
        <div className="quiz-toolbar" role="tablist" aria-label="Quiz status">
          {[
            ['ALL', 'All Quizzes'],
            ['LIVE', 'Live'],
            ['UPCOMING', 'Upcoming'],
            ['COMPLETED', 'Completed'],
          ].map(([value, label]) => (
            <button key={value} role="tab" aria-selected={statusView === value} className={`btn ${statusView === value ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setStatusView(value)}>
              {label}
            </button>
          ))}
        </div>
      )}
      {filtered.length > 0 ? (
        <div className="quiz-grid">
          {filtered.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} progress={progress[quiz.id]} onStart={(q) => navigate(`/student/quiz/${q.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState icon="\uD83D\uDCC5" title="No quizzes found" message="There are no quizzes matching your search. Try adjusting your filters."
          action={<button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>} />
      )}
    </div>
  );
}
