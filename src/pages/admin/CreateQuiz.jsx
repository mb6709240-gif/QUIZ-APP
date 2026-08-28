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
    scheduledEnabled: false, openDate: '', openTime: '', closeDate: '', closeTime: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.duration || form.duration < 1) errs.duration = 'Duration must be at least 1 minute';
    if (!form.passingPercentage || form.passingPercentage < 1 || form.passingPercentage > 100) errs.passingPercentage = 'Passing percentage must be 1-100';
    if (form.scheduledEnabled && (!form.openDate || !form.openTime || !form.closeDate || !form.closeTime)) errs.schedule = 'Please provide opening and closing date/time';
    if (form.scheduledEnabled && form.openDate && form.openTime && form.closeDate && form.closeTime) {
      if (new Date(`${form.closeDate}T${form.closeTime}`) <= new Date(`${form.openDate}T${form.openTime}`)) errs.schedule = 'Closing time must be after opening time';
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
      openDate: form.scheduledEnabled ? form.openDate : null,
      openTime: form.scheduledEnabled ? form.openTime : null,
      closeDate: form.scheduledEnabled ? form.closeDate : null,
      closeTime: form.scheduledEnabled ? form.closeTime : null,
      scheduledAt: form.scheduledEnabled ? new Date(`${form.openDate}T${form.openTime}`).toISOString() : null,
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
              <div className="form-row">
                <div className="form-group"><label className="form-label">Open Date</label><input type="date" className="form-input" value={form.openDate} onChange={(e) => update('openDate', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Open Time</label><input type="time" className="form-input" value={form.openTime} onChange={(e) => update('openTime', e.target.value)} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Close Date</label><input type="date" className="form-input" value={form.closeDate} onChange={(e) => update('closeDate', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Close Time</label><input type="time" className="form-input" value={form.closeTime} onChange={(e) => update('closeTime', e.target.value)} /></div>
              </div>
              {errors.schedule && <span className="form-error">{errors.schedule}</span>}
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
