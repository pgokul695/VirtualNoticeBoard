import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// This component now uses CSS :hover for the dropdown, which is more robust.
const NavItemWithDropdown = ({ item, isActive }) => {
  const navigate = useNavigate();

  return (
    <div className="nav-item-with-dropdown">
      <button className={`nav-button ${isActive ? 'active' : ''}`}>
        <span>{item.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      <div className="dropdown-menu">
        {item.subItems.map((subItem) => (
          <button 
            key={subItem.name} 
            onClick={() => navigate(subItem.path)}
            className="dropdown-item"
          >
            {subItem.name}
          </button>
        ))}
      </div>
    </div>
  );
};


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Notices', path: '/notices' },
    { 
      name: 'Departments', 
      path: '/departments',
      subItems: [
        { name: 'CSE', path: '/departments/CSE' },
        { name: 'AI & DS', path: '/departments/AI & DS' },
        { name: 'ECE', path: '/departments/ECE' },
        { name: 'EEE', path: '/departments/EEE' },
      ] 
    },
    { 
      name: 'Clubs', 
      path: '/clubs',
      subItems: [
        { name: 'IEEE', path: '/clubs/IEEE' },
        { name: 'CSI', path: '/clubs/CSI' },
        { name: 'GDSC', path: '/clubs/GDSC' },
        { name: 'Tinkerhub', path: '/clubs/Tinkerhub' },
      ]
    },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin', path: '/admin' });
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon-wrapper">
              <Bell className="w-5 h-5" />
            </div>
            <div className="logo-text">
              <h1>Virtual Notice Board</h1>
              <p>Stay updated with latest announcements</p>
            </div>
          </div>

          <nav className="main-nav">
            {navigation.map((item) => (
              item.subItems ? (
                <NavItemWithDropdown 
                  key={item.name} 
                  item={item} 
                  isActive={isActive(item.path)}
                />
              ) : (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.name}
                </button>
              )
            ))}
          </nav>

          <div className="user-actions">
            {user ? (
              <>
                <button className="icon-btn" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('/profile')} className="user-profile-btn" aria-label="User profile">
                  <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                  <span className="user-name">{user?.name || 'User'}</span>
                </button>
                <button onClick={signOut} className="icon-btn" title="Sign Out" aria-label="Sign out">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-signin">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
