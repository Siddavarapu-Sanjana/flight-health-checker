// src/components/FlightsPage.jsx
import { useState, useEffect } from 'react';
import { flights } from '../data/flights';
import FlightCard from './FlightCard';
import { calculateOverallHealth } from '../utils/healthUtils';
import { flightsToCSV, downloadCSV } from '../utils/exportUtils';

function FlightsPage() {
  // Load saved preferences from localStorage, or use defaults
  const loadPreference = (key, defaultValue) => {
    const saved = localStorage.getItem(`flightPref_${key}`);
    return saved !== null ? saved : defaultValue;
  };

  const [healthFilter, setHealthFilter] = useState(() => 
    loadPreference('healthFilter', 'all')
  );
  const [searchQuery, setSearchQuery] = useState(() => 
    loadPreference('searchQuery', '')
  );
  const [sortBy, setSortBy] = useState(() => 
    loadPreference('sortBy', 'health')
  );

  // Save preferences whenever they change
  useEffect(() => {
    localStorage.setItem('flightPref_healthFilter', healthFilter);
  }, [healthFilter]);

  useEffect(() => {
    localStorage.setItem('flightPref_searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('flightPref_sortBy', sortBy);
  }, [sortBy]);

  const getFlightHealth = (flight) => {
    return calculateOverallHealth(
      flight.engineHealth,
      flight.airframeAge,
      flight.maintenanceDays,
      flight.pilotHours
    );
  };

  const getFlightRatingCategory = (flight) => {
    const health = getFlightHealth(flight);
    if (health >= 85) return 'excellent';
    if (health >= 70) return 'good';
    if (health >= 50) return 'warning';
    return 'critical';
  };

  let filteredFlights = flights.filter(flight => {
    if (healthFilter !== 'all') {
      const category = getFlightRatingCategory(flight);
      if (category !== healthFilter) return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesFlight = flight.flightNumber.toLowerCase().includes(query);
      const matchesAirline = flight.airline.toLowerCase().includes(query);
      if (!matchesFlight && !matchesAirline) return false;
    }
    
    return true;
  });

  if (sortBy === 'health') {
    filteredFlights.sort((a, b) => getFlightHealth(b) - getFlightHealth(a));
  } else if (sortBy === 'flightNumber') {
    filteredFlights.sort((a, b) => a.flightNumber.localeCompare(b.flightNumber));
  }

  // Clear all preferences
  const clearAllPreferences = () => {
    localStorage.removeItem('flightPref_healthFilter');
    localStorage.removeItem('flightPref_searchQuery');
    localStorage.removeItem('flightPref_sortBy');
    setHealthFilter('all');
    setSearchQuery('');
    setSortBy('health');
  };

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ flex: '2', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="🔍 Search by flight number or airline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Health Status</option>
              <option value="excellent">🟢 Excellent Only</option>
              <option value="good">🟡 Good Only</option>
              <option value="warning">🟠 Warning Only</option>
              <option value="critical">🔴 Critical Only</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="health">Sort by Health (Best First)</option>
              <option value="flightNumber">Sort by Flight Number</option>
            </select>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Showing {filteredFlights.length} of {flights.length} flights
            {searchQuery && ` matching "${searchQuery}"`}
            {healthFilter !== 'all' && ` with ${healthFilter} health status`}
          </div>
          
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            <span>💾 Preferences saved automatically</span>
            <button
              onClick={clearAllPreferences}
              style={{
                marginLeft: '12px',
                padding: '4px 12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Reset Preferences
            </button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredFlights.map(flight => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '48px' }}>🔍</span>
          <h3>No flights found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button
            onClick={clearAllPreferences}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}

export default FlightsPage;