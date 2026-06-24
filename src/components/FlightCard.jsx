// src/components/FlightCard.jsx
import { Link } from 'react-router-dom';
import { calculateOverallHealth, getRating, getHealthColor } from '../utils/healthUtils';

function FlightCard({ flight }) {
  const health = calculateOverallHealth(
    flight.engineHealth,
    flight.airframeAge,
    flight.maintenanceDays,
    flight.pilotHours
  );
  
  const rating = getRating(health);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link to={`/flight/${flight.id}`} style={{ textDecoration: 'none' }}>
      <div className="slide-in" style={{
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '20px',
        padding: '20px',
        backgroundColor: 'white',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 30px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600', marginBottom: '4px' }}>
              {flight.airline}
            </div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>
              ✈️ {flight.flightNumber}
            </h3>
          </div>
          <div style={{
            backgroundColor: rating.bgColor,
            color: rating.color,
            padding: '6px 12px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {rating.emoji} {rating.text}
          </div>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
            {flight.origin} → {flight.destination}
          </div>
          <div style={{ color: '#999', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>🕐</span> {formatDate(flight.departure)}
          </div>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
            <span>Overall Health</span>
            <span style={{ color: getHealthColor(health) }}>{health}%</span>
          </div>
          <div style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            height: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${health}%`,
              backgroundColor: getHealthColor(health),
              height: '100%',
              borderRadius: '10px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
        
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#667eea', textAlign: 'right' }}>
          View details →
        </div>
      </div>
    </Link>
  );
}

export default FlightCard;