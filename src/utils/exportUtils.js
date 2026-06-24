// src/utils/exportUtils.js

/**
 * Convert flight data to CSV format
 * @param {Array} flights - Array of flight objects
 * @param {Array} headers - Custom headers (optional)
 * @returns {string} CSV string
 */
export function flightsToCSV(flights, headers = null) {
  // Default headers if not provided
  const defaultHeaders = [
    'Flight Number',
    'Airline',
    'Origin',
    'Destination',
    'Departure',
    'Engine Health (%)',
    'Airframe Age (years)',
    'Maintenance (days ago)',
    'Pilot Hours',
    'Overall Health (%)',
    'Health Rating',
    'Recommendation'
  ];

  const csvHeaders = headers || defaultHeaders;

  // Create header row
  let csv = csvHeaders.join(',') + '\n';

  // Add each flight as a row
  flights.forEach(flight => {
    // Calculate health if not already provided
    const health = flight.overallHealth || calculateOverallHealth(
      flight.engineHealth,
      flight.airframeAge,
      flight.maintenanceDays,
      flight.pilotHours
    );
    
    const rating = flight.rating || getRating(health);
    const recommendation = flight.recommendation || getRecommendation(health);

    // Build row data in the order of headers
    const rowData = csvHeaders.map(header => {
      switch(header) {
        case 'Flight Number': return flight.flightNumber;
        case 'Airline': return `"${flight.airline}"`;
        case 'Origin': return `"${flight.origin}"`;
        case 'Destination': return `"${flight.destination}"`;
        case 'Departure': return flight.departure;
        case 'Engine Health (%)': return flight.engineHealth;
        case 'Airframe Age (years)': return flight.airframeAge;
        case 'Maintenance (days ago)': return flight.maintenanceDays;
        case 'Pilot Hours': return flight.pilotHours;
        case 'Overall Health (%)': return health;
        case 'Health Rating': return rating.text;
        case 'Recommendation': return `"${recommendation}"`;
        default: return '';
      }
    });

    csv += rowData.join(',') + '\n';
  });

  return csv;
}

/**
 * Download CSV as a file
 * @param {string} csvContent - CSV string
 * @param {string} filename - Name of the file to download
 */
export function downloadCSV(csvContent, filename = 'flight_data.csv') {
  // Create a Blob (file-like object)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Get recommendation based on health score
 */
function getRecommendation(health) {
  if (health >= 85) return "This vehicle is in excellent condition";
  if (health >= 70) return "Minor concerns detected. Schedule routine checkup";
  if (health >= 50) return "Warning: Significant wear detected. Inspection recommended";
  return "Critical: Immediate maintenance required before next operation";
}

/**
 * Get rating based on health score
 */
function getRating(health) {
  if (health >= 85) return { text: "Excellent", color: "#22c55e", emoji: "🟢", bgColor: "#dcfce7" };
  if (health >= 70) return { text: "Good", color: "#eab308", emoji: "🟡", bgColor: "#fef9c3" };
  if (health >= 50) return { text: "Warning", color: "#f97316", emoji: "🟠", bgColor: "#ffedd5" };
  return { text: "Critical", color: "#ef4444", emoji: "🔴", bgColor: "#fee2e2" };
}

/**
 * Calculate overall health (helper function)
 */
function calculateOverallHealth(engineHealth, airframeAge, maintenanceDays, pilotHours) {
  const ageScore = Math.max(0, 100 - (airframeAge * 5));
  const maintenanceScore = Math.max(0, 100 - (maintenanceDays * 1.5));
  const pilotScore = Math.min(100, (pilotHours / 5000) * 100);
  const health = (engineHealth * 0.4) + (ageScore * 0.3) + (maintenanceScore * 0.2) + (pilotScore * 0.1);
  return Math.round(health);
}