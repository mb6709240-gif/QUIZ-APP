import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/storage';
import ThemeToggle from '../components/ThemeToggle';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const navItems = [
    { to: '/admin/dashboard', icon: '\uD83D\uDCCA', label: 'Dashboard' },
    { to: '/admin/quizzes', icon: '\uD83D\uDCDD', label: 'Quizzes' },
    { to: '/admin/questions', icon: '\u2753', label: 'Questions' },
    { to: '/admin/students', icon: '\uD83D\uDC65', label: 'Students' },
    { to: '/admin/results', icon: '\uD83C\uDFC6', label: 'Results' },
    { to: '/admin/analytics', icon: '\uD83D\uDCC8', label: 'Analytics' },
  ];
  const bottomNavItems = [{ to: '/admin/settings', icon: '\u2699\uFE0F', label: 'Settings' }];

  return (
    <div className="layout-wrapper admin-layout">
      <header className="layout-header-mobile">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>{'\u2630'}</button>
        <span className="layout-logo-mobile">QuizFlow Admin</span>
        <ThemeToggle />
      </header>
      <aside className={`sidebar admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo admin-logo">
            <span className="sidebar-logo-icon admin-logo-icon">A</span>
            <div>
              <span className="sidebar-logo-text">QuizFlow</span>
              <span className="sidebar-logo-subtitle">ADMIN PANEL</span>
            </div>
          </div>
          <button className="sidebar-close show-mobile-only" onClick={() => setSidebarOpen(false)}>{'\u2715'}</button>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-nav-group">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/admin/dashboard'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <span className="sidebar-icon">{item.icon}</span><span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-nav-group">
            {bottomNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <span className="sidebar-icon">{item.icon}</span><span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="sidebar-divider" />
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-icon">{'\uD83D\uDEAA'}</span><span>Logout</span>
          </button>
        </nav>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay show-mobile-only" onClick={() => setSidebarOpen(false)} />}
      <div className="layout-main">
        <header className="layout-header">
          <div className="header-search">
            <span className="header-search-icon">{'\uD83D\uDD0D'}</span>
            <input type="text" placeholder="Search..." className="header-search-input" />
          </div>
          <div className="header-actions">
            <button className="header-icon-btn" aria-label="Notifications">{'\uD83D\uDD14'}</button>
            <ThemeToggle />
            <div className="header-avatar admin-avatar"><span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span></div>
          </div>
        </header>
        <main className="layout-content"><Outlet /></main>
      </div>
      <nav className="bottom-nav">
        {navItems.slice(0, 4).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/admin/dashboard'} className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}>
            <span className="bottom-nav-icon">{item.icon}</span><span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
