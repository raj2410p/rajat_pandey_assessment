import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      padding: '16px 40px', 
      background: 'var(--card-bg)', 
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Layout className="primary" style={{ color: 'var(--primary)' }} />
        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>AI Task Platform</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Hello, {user?.name}</span>
        <button onClick={logout} style={{ 
          background: 'transparent', 
          color: 'var(--text-muted)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '8px'
        }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}
