// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const linkStyle = (path) => ({
    padding: '10px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
    color: 'white',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  });
  
  return (
    <nav style={{
      display: 'flex',
      gap: '16px',
      marginTop: '24px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      <Link to="/" style={linkStyle('/')}>
        <span>🏠</span> Home
      </Link>
      <Link to="/flights" style={linkStyle('/flights')}>
        <span>✈️</span> Flight Health Data
      </Link>
      <Link to="/maintenance" style={linkStyle('/maintenance')}>
        <span>🔧</span> Maintenance Schedule
      </Link>
    </nav>
  );
}

export default Navigation;