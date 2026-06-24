// src/components/HomePage.jsx
import { Link } from 'react-router-dom';
import { flights } from '../data/flights';
import { calculateOverallHealth } from '../utils/healthUtils';

function HomePage() {
  // Calculate statistics
  const healthScores = flights.map(flight => 
    calculateOverallHealth(flight.engineHealth, flight.airframeAge, flight.maintenanceDays, flight.pilotHours)
  );
  
  const averageHealth = Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length);
  
  const excellentCount = healthScores.filter(h => h >= 85).length;
  const goodCount = healthScores.filter(h => h >= 70 && h < 85).length;
  const warningCount = healthScores.filter(h => h >= 50 && h < 70).length;
  const criticalCount = healthScores.filter(h => h < 50).length;
  
  // Find healthiest flight
  let maxHealth = -1;
  let healthiestFlight = null;
  flights.forEach(flight => {
    const health = calculateOverallHealth(flight.engineHealth, flight.airframeAge, flight.maintenanceDays, flight.pilotHours);
    if (health > maxHealth) {
      maxHealth = health;
      healthiestFlight = flight;
    }
  });
  
  // Find flights needing maintenance
  const flightsNeedingMaintenance = flights.filter(flight => flight.maintenanceDays > 40);
  
  const StatCard = ({ title, value, color, icon, subtext }) => (
    <div style={{
      background: 'linear-gradient(135deg, white 0%, #f8f9fa 100%)',
      borderRadius: '20px',
      padding: '24px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '36px', fontWeight: '800', color: color }}>{value}</div>
      <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>{title}</div>
      {subtext && <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>{subtext}</div>}
    </div>
  );
  
  const CategoryCard = ({ label, count, color, bgColor, icon }) => (
    <div style={{
      backgroundColor: bgColor,
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: color }}>{count}</div>
      <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>{label}</div>
    </div>
  );
  
  return (
    <div>
      {/* Welcome Section */}
      <div className="fade-in" style={{
        background: 'linear-gradient(135deg, #101942 0%, #764ba2 100%)',
        borderRadius: '24px',
        padding: '48px 32px',
        marginBottom: '32px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', fontWeight: '700' }}>
          Your Safety, Our Priority
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '600px', margin: '0 auto' }}>
          Real-time health monitoring for every flight in our fleet. 
          Transparent data you can trust.
        </p>
      </div>
      
      {/* Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <StatCard title="Total Flights" value={flights.length} color="#667eea" icon="✈️" subtext="Active fleet" />
        <StatCard title="Average Health" value={`${averageHealth}%`} color="#22c55e" icon="📊" subtext="Fleet average" />
        <StatCard title="Healthiest Flight" value={healthiestFlight?.flightNumber || 'N/A'} color="#10b981" icon="🏆" subtext={healthiestFlight?.airline} />
      </div>
      
      {/* Health Distribution */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>
          📈 Fleet Health Distribution
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <CategoryCard label="Excellent" count={excellentCount} color="#22c55e" bgColor="#dcfce7" icon="🟢" />
          <CategoryCard label="Good" count={goodCount} color="#eab308" bgColor="#fef9c3" icon="🟡" />
          <CategoryCard label="Warning" count={warningCount} color="#f97316" bgColor="#ffedd5" icon="🟠" />
          <CategoryCard label="Critical" count={criticalCount} color="#ef4444" bgColor="#fee2e2" icon="🔴" />
        </div>
      </div>
      
      {/* Healthiest Flight Highlight */}
      {healthiestFlight && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '8px' }}>🏆</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#166534' }}>
            Healthiest Flight in Fleet
          </h3>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#15803d', marginBottom: '8px' }}>
            {healthiestFlight.flightNumber}
          </div>
          <p style={{ color: '#166534', marginBottom: '16px' }}>
            {healthiestFlight.origin} → {healthiestFlight.destination} • {healthiestFlight.airline}
          </p>
          <Link to={`/flight/${healthiestFlight.id}`}>
            <button style={{
              padding: '12px 32px',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              View Flight Details →
            </button>
          </Link>
        </div>
      )}
      
      {/* Maintenance Alert */}
      {flightsNeedingMaintenance.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid #fde68a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '40px' }}>⚠️</span>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#92400e' }}>
              Maintenance Alert
            </h3>
          </div>
          <p style={{ color: '#92400e', marginBottom: '20px', fontSize: '16px' }}>
            {flightsNeedingMaintenance.length} flight(s) have not been serviced in over 40 days.
            Immediate attention recommended.
          </p>
          <Link to="/maintenance">
            <button style={{
              padding: '10px 24px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Maintenance Schedule →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;