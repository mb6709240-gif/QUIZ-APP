import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, setCurrentUser } from '../utils/storage';
import { useToast } from '../components/Toast';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = users.find((u) => u.email === email && u.password === password && u.role === role);
      if (!user) { toast.error('Invalid credentials or wrong role selected'); setLoading(false); return; }
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }, 500);
  };

  const fillDemo = (demoRole) => {
    if (demoRole === 'admin') { setRole('admin'); setEmail('admin@quiz.com'); setPassword('admin123'); }
    else { setRole('student'); setEmail('student@quiz.com'); setPassword('student123'); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-decoration">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
      </div>
      <div className="auth-container">
        <div className="auth-card glass">
          <div className="auth-brand">
            <div className="auth-logo"><span className="auth-logo-icon">Q</span></div>
            <h1 className="auth-title">QuizFlow</h1>
            <p className="auth-tagline">Smart Assessment. Better Learning.</p>
          </div>
          <div className="role-selector">
            <button className={`role-tab ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>
              <span>{'\uD83C\uDF93'}</span><span>Student</span>
            </button>
            <button className={`role-tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>
              <span>{'\uD83D\uDEE1\uFE0F'}</span><span>Admin</span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="auth-form-title">{role === 'student' ? 'Student Login' : 'Admin Login'}</h2>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Signing in...' : `Login as ${role === 'student' ? 'Student' : 'Admin'}`}
            </button>
          </form>
          {role === 'student' && (
            <p className="auth-footer">Don't have an account? <Link to="/register" className="auth-link">Create Student Account</Link></p>
          )}
          <div className="demo-credentials">
            <button className="demo-toggle" onClick={() => setShowDemo(!showDemo)}>Demo Credentials {showDemo ? '\u25B2' : '\u25BC'}</button>
            {showDemo && (
              <div className="demo-content">
                <div className="demo-row" onClick={() => fillDemo('admin')}>
                  <span className="badge badge-info">Admin</span>
                  <span className="demo-detail">admin@quiz.com / admin123</span>
                </div>
                <div className="demo-row" onClick={() => fillDemo('student')}>
                  <span className="badge badge-primary">Student</span>
                  <span className="demo-detail">student@quiz.com / student123</span>
                </div>
                <p className="demo-hint">Click a row to auto-fill</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
