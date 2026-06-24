// src/App.js
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import FlightsPage from './components/FlightsPage';
import MaintenancePage from './components/MaintenancePage';
import FlightDetail from './components/FlightDetail';
import { flights } from './data/flights';
import './index.css';

// Helper to find flight by ID
const getFlightById = (id) => {
  return flights.find(flight => flight.id === parseInt(id));
};

// Flight Detail Wrapper
function FlightDetailWrapper() {
  const { id } = useParams();
  const flight = getFlightById(id);
  
  if (!flight) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>✈️ Flight not found</h2>
        <Link to="/flights" style={{ color: '#667eea' }}>← Back to flights</Link>
      </div>
    );
  }
  
  return <FlightDetail flight={flight} />;
}

// Main App Component
function AppContent() {
  return (
    <div className="fade-in" style={{
      fontFamily: 'Inter, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <header style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #101942 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '24px',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✈️</div>
          <h1 style={{ margin: 0, fontSize: '42px', fontWeight: '800', letterSpacing: '-1px' }}>
            Flight Health Checker
          </h1>
          <p style={{ margin: '12px 0 0', opacity: 0.95, fontSize: '18px' }}>
            Transparent health data for safer travel decisions
          </p>
        </Link>
        <Navigation />
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/flight/:id" element={<FlightDetailWrapper />} />
      </Routes>

      <footer style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '30px',
        color: '#f1ebeb',
        fontSize: '14px',
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        <p>Health scores calculated based on engine health, airframe age, maintenance recency, and pilot experience.</p>
        <p style={{ marginTop: '12px', opacity: 0.7 }}>© 2026 Flight Health Checker — Making aviation safer</p>
      </footer>
    </div>
  );
}

// Main App with Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;