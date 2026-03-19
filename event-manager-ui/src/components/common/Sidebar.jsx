import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

export const Sidebar = ({ isAdmin, active = '', isMobile = false, onClose }) => {
  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Browse Events' },
    { path: '/my-registrations', label: 'My Registrations' },
    { path: '/profile', label: 'Profile' }
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/events', label: 'Manage Events' },
    { path: '/admin/users', label: 'Manage Users' },
    { path: '/admin/registrations', label: 'Registrations' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className={`sidebar ${isMobile ? 'mobile' : ''}`}>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${active === link.path ? 'active' : ''}`}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
