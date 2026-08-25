import { useState, useMemo } from 'react';
import { getCurrentUser, setCurrentUser, getResults, getUsers, saveUsers } from '../../utils/storage';
import { useToast } from '../../components/Toast';

export default function StudentProfile() {
  const user = getCurrentUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const toast = useToast();

  const stats = useMemo(() => {
    const results = getResults().filter((r) => r.studentId === user?.id);
    const totalAttempts = results.length;
    const avgScore = totalAttempts > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalAttempts) : 0;
    const bestScore = totalAttempts > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;
    return { totalAttempts, avgScore, bestScore };
  }, [user]);

  const handleSave = () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) { users[idx].name = name.trim(); saveUsers(users); }
    setCurrentUser({ ...user, name: name.trim() });
    toast.success('Profile updated successfully');
    setEditing(false);
  };

  const statCards = [
    { icon: '\uD83D\uDCDD', label: 'Total Attempts', value: stats.totalAttempts },
    { icon: '\uD83D\uDCCA', label: 'Average Score', value: `${stats.avgScore}%` },
    { icon: '\uD83C\uDFC6', label: 'Best Score', value: `${stats.bestScore}%` },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">View and manage your account information</p>
      </div>
      <div className="profile-layout">
        <div className="profile-card card">
          <div className="profile-avatar-large"><span>{user?.name?.charAt(0).toUpperCase() || 'S'}</span></div>
          {editing ? (
            <div className="profile-edit">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="profile-edit-actions">
                <button className="btn btn-secondary" onClick={() => { setEditing(false); setName(user.name); }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <span className="badge badge-primary">{user?.role === 'student' ? '\uD83C\uDF93 Student' : '\uD83D\uDEE1\uFE0F Admin'}</span>
              <button className="btn btn-secondary w-full mt-4" onClick={() => setEditing(true)}>{'\u270F\uFE0F'} Edit Name</button>
            </>
          )}
        </div>
        <div className="profile-stats">
          {statCards.map((stat, i) => (
            <div key={stat.label} className="stat-card card card-hover" style={{ animationDelay: `${i * 80}ms`, animation: 'fadeInUp 0.5s ease backwards' }}>
              <div className="stat-card-decoration gradient-primary" />
              <div className="stat-card-content">
                <div className="stat-card-icon">{stat.icon}</div>
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
