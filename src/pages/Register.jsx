import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils/storage';
import { useToast } from '../components/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    const users = getUsers();
    if (users.find((u) => u.email === email)) errs.email = 'An account with this email already exists';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const newUser = { id: `user_${Date.now()}`, name: name.trim(), email, password, role: 'student' };
      users.push(newUser);
      saveUsers(users);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    }, 500);
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-tagline">Join QuizFlow as a student</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Student Account'}
            </button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
