// src/components/FlightDetail.jsx
import { useNavigate } from 'react-router-dom';
import { calculateOverallHealth, getRating, getHealthColor } from '../utils/healthUtils';
import { downloadCSV } from '../utils/exportUtils';

function FlightDetail({ flight }) {
  const navigate = useNavigate();
  
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const HealthBar = ({ label, value, unit, color, subtext }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontWeight: '500' }}>{label}</span>
        <span>{value}{unit}</span>
      </div>
      <div style={{ backgroundColor: '#e5e7eb', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, backgroundColor: color, height: '100%' }}></div>
      </div>
      {subtext && <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{subtext}</div>}
    </div>
  );

  const getRecommendation = (health) => {
    if (health >= 85) return "This vehicle is in excellent condition";
    if (health >= 70) return "Minor concerns detected. Schedule routine checkup";
    if (health >= 50) return "Warning: Significant wear detected. Inspection recommended";
    return "Critical: Immediate maintenance required before next operation";
  };

  const exportSingleFlight = () => {
    const headers = [
      'Flight Number', 'Airline', 'Origin', 'Destination', 'Departure',
      'Engine Health (%)', 'Airframe Age (years)', 'Maintenance (days ago)',
      'Pilot Hours', 'Overall Health (%)', 'Health Rating', 'Recommendation'
    ];

    const recommendation = getRecommendation(health);

    const row = [
      flight.flightNumber,
      `"${flight.airline}"`,
      `"${flight.origin}"`,
      `"${flight.destination}"`,
      flight.departure,
      flight.engineHealth,
      flight.airframeAge,
      flight.maintenanceDays,
      flight.pilotHours,
      health,
      rating.text,
      `"${recommendation}"`
    ];

    const csv = headers.join(',') + '\n' + row.join(',');
    const filename = `${flight.flightNumber}_health_report_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csv, filename);
  };

  const copyFlightData = () => {
    const recommendation = getRecommendation(health);

    const text = `
  ✈️ FLIGHT HEALTH REPORT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Flight: ${flight.flightNumber}
  Airline: ${flight.airline}
  Route: ${flight.origin} → ${flight.destination}
  Departure: ${formatDate(flight.departure)}
  
  📊 HEALTH METRICS
  ─────────────────────
  Engine Health: ${flight.engineHealth}%
  Airframe Age: ${flight.airframeAge} years
  Maintenance: ${flight.maintenanceDays} days ago
  Pilot Experience: ${flight.pilotHours} hours
  
  ⭐ Overall Health: ${health}% - ${rating.text}
  💡 Recommendation: ${recommendation}
  
  Report generated: ${new Date().toLocaleString()}
  `;

    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Flight data copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy. Please try again.');
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: '#f3f4f6',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        ← Back
      </button>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ margin: 0 }}>✈️ {flight.flightNumber}</h1>
          <span style={{
            backgroundColor: rating.bgColor,
            color: rating.color,
            padding: '6px 14px',
            borderRadius: '24px',
            fontWeight: 'bold'
          }}>
            {rating.emoji} {rating.text}
          </span>
        </div>
        
        <div style={{ color: '#4b5563', marginBottom: '8px' }}>
          {flight.airline}
        </div>
        
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          {flight.origin} → {flight.destination}
        </div>
        
        <div style={{ color: '#6b7280', marginBottom: '24px' }}>
          🕐 {formatDate(flight.departure)}
        </div>
        
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '8px' }}>
          <h3 style={{ marginBottom: '16px' }}>📊 Health Report</h3>
          
          <HealthBar 
            label="🔧 Engine Health" 
            value={flight.engineHealth} 
            unit="%" 
            color={getHealthColor(flight.engineHealth)} 
          />
          
          <HealthBar 
            label="📅 Airframe Age" 
            value={Math.max(0, 100 - (flight.airframeAge * 5))} 
            unit="%" 
            color="#3b82f6"
            subtext={`${flight.airframeAge} years old`}
          />
          
          <HealthBar 
            label="🛠️ Maintenance Status" 
            value={Math.max(0, 100 - (flight.maintenanceDays * 1.5))} 
            unit="%" 
            color="#8b5cf6"
            subtext={`Last service ${flight.maintenanceDays} days ago`}
          />
          
          <HealthBar 
            label="👨‍✈️ Pilot Experience" 
            value={Math.min(100, (flight.pilotHours / 5000) * 100)} 
            unit="%" 
            color="#10b981"
            subtext={`${flight.pilotHours} total hours`}
          />
        </div>
        
        <div style={{
          backgroundColor: rating.bgColor,
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: rating.color }}>
            {health}%
          </div>
          <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>
            Overall Health - {rating.text}
          </div>
          <div style={{ fontSize: '13px', marginTop: '8px', color: '#4b5563' }}>
            {rating.emoji} {getRecommendation(health)}
          </div>
        </div>

        {/* Export and Copy Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={exportSingleFlight}
            style={{
              padding: '10px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            📥 Export This Flight's Data
          </button>
          
          <button
            onClick={copyFlightData}
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            📋 Copy Flight Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlightDetail;