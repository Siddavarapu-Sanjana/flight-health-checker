// src/components/MaintenancePage.jsx
import { Link } from 'react-router-dom';
import { flights } from '../data/flights';

function MaintenancePage() {
  // Filter flights needing maintenance (over 40 days)
  const overdueFlights = flights.filter(flight => flight.maintenanceDays > 40);
  const upcomingFlights = flights.filter(flight => flight.maintenanceDays >= 30 && flight.maintenanceDays <= 40);
  
  const getUrgency = (days) => {
    if (days > 60) return { text: 'Overdue', color: '#ef4444', bg: '#fee2e2' };
    if (days > 40) return { text: 'Due Soon', color: '#f97316', bg: '#ffedd5' };
    if (days >= 30) return { text: 'Upcoming', color: '#eab308', bg: '#fef9c3' };
    return { text: 'OK', color: '#22c55e', bg: '#dcfce7' };
  };
  
  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 8px 0' }}>🔧 Maintenance Schedule</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Track maintenance status across the fleet. Flights are listed by maintenance urgency.
        </p>
      </div>
      
      {overdueFlights.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '16px' }}>⚠️ Critical - Immediate Attention</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {overdueFlights.map(flight => {
              const urgency = getUrgency(flight.maintenanceDays);
              return (
                <div key={flight.id} style={{
                  backgroundColor: urgency.bg,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <strong>{flight.flightNumber}</strong> - {flight.airline}
                    <div style={{ fontSize: '13px', color: '#4b5563' }}>
                      {flight.origin} → {flight.destination}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: urgency.color }}>{urgency.text}</div>
                    <div style={{ fontSize: '13px' }}>{flight.maintenanceDays} days since last service</div>
                  </div>
                  <Link to={`/flight/${flight.id}`}>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      View Details →
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {upcomingFlights.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#f97316', marginBottom: '16px' }}>🟠 Upcoming Maintenance (30-40 days)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingFlights.map(flight => {
              const urgency = getUrgency(flight.maintenanceDays);
              return (
                <div key={flight.id} style={{
                  backgroundColor: urgency.bg,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <strong>{flight.flightNumber}</strong> - {flight.airline}
                    <div style={{ fontSize: '13px', color: '#4b5563' }}>
                      {flight.origin} → {flight.destination}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: urgency.color }}>{urgency.text}</div>
                    <div style={{ fontSize: '13px' }}>{flight.maintenanceDays} days since last service</div>
                  </div>
                  <Link to={`/flight/${flight.id}`}>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      View Details →
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {overdueFlights.length === 0 && upcomingFlights.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: 'white',
          borderRadius: '12px',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '48px' }}>✅</span>
          <h3>All flights are up to date on maintenance</h3>
          <p>No upcoming maintenance required at this time.</p>
        </div>
      )}
    </div>
  );
}

export default MaintenancePage;