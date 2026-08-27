import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes, saveQuizzes } from '../../utils/storage';
import { useToast } from '../../components/Toast';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    title: '', description: '', subject: '', difficulty: 'Easy',
    duration: 30, passingPercentage: 50,
    scheduledEnabled: false, scheduledAt: '', scheduledEnd: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.duration || form.duration < 1) errs.duration = 'Duration must be at least 1 minute';
    if (!form.passingPercentage || form.passingPercentage < 1 || form.passingPercentage > 100) errs.passingPercentage = 'Passing percentage must be 1-100';
    if (form.scheduledEnabled && !form.scheduledAt) errs.scheduledAt = 'Please pick an opening date and time';
    if (form.scheduledEnabled && !form.scheduledEnd) errs.scheduledEnd = 'Please pick a closing date and time';
    if (form.scheduledEnabled && form.scheduledAt && form.scheduledEnd) {
      const start = new Date(form.scheduledAt).getTime();
      const end = new Date(form.scheduledEnd).getTime();
      if (isNaN(start) || isNaN(end) || end <= start) errs.scheduledEnd = 'Closing time must be after opening time';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const quizzes = getQuizzes();
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim(),
      difficulty: form.difficulty,
      duration: parseInt(form.duration),
      totalMarks: 0,
      passingPercentage: parseInt(form.passingPercentage),
      published: false,
      questions: [],
      scheduledEnabled: form.scheduledEnabled,
      scheduledAt: form.scheduledEnabled ? new Date(form.scheduledAt).toISOString() : null,
      scheduledEnd: form.scheduledEnabled ? new Date(form.scheduledEnd).toISOString() : null,
    };
    quizzes.push(newQuiz);
    saveQuizzes(quizzes);
    toast.success('Quiz created successfully');
    navigate(`/admin/quizzes/${newQuiz.id}`);
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create New Quiz</h1>
        <p className="page-subtitle">Set up a new quiz for your students</p>
      </div>
      <div className="form-card card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input type="text" className="form-input" placeholder="e.g., Java Programming" value={form.title} onChange={(e) => update('title', e.target.value)} />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows="3" placeholder="e.g., Test your Java fundamentals" value={form.description} onChange={(e) => update('description', e.target.value)} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" placeholder="e.g., Java" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input type="number" className="form-input" min="1" value={form.duration} onChange={(e) => update('duration', e.target.value)} />
              {errors.duration && <span className="form-error">{errors.duration}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Passing Percentage</label>
              <input type="number" className="form-input" min="1" max="100" value={form.passingPercentage} onChange={(e) => update('passingPercentage', e.target.value)} />
              {errors.passingPercentage && <span className="form-error">{errors.passingPercentage}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="toggle-label-row">
              <div>
                <span className="settings-toggle-label">Schedule Quiz Open Time</span>
                <p className="settings-toggle-desc">Set when this quiz becomes available to students</p>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={form.scheduledEnabled} onChange={(e) => update('scheduledEnabled', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </label>
          </div>
          {form.scheduledEnabled && (
            <>
              <div className="form-group">
                <label className="form-label">Quiz Opens At</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.scheduledAt}
                  onChange={(e) => update('scheduledAt', e.target.value)}
                />
                {errors.scheduledAt && <span className="form-error">{errors.scheduledAt}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Quiz Closes At</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.scheduledEnd}
                  onChange={(e) => update('scheduledEnd', e.target.value)}
                />
                {errors.scheduledEnd && <span className="form-error">{errors.scheduledEnd}</span>}
              </div>
            </>
          )}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/quizzes')}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Quiz</button>
          </div>
        </form>
      </div>
    </div>
  );
}
