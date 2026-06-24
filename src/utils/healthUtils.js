// src/utils/healthUtils.js

export function calculateOverallHealth(engineHealth, airframeAge, maintenanceDays, pilotHours) {
  // Convert airframe age to a score (0 years = 100, 20+ years = 0)
  const ageScore = Math.max(0, 100 - (airframeAge * 5));
  
  // Convert maintenance days to a score (0 days = 100, 67+ days = 0)
  const maintenanceScore = Math.max(0, 100 - (maintenanceDays * 1.5));
  
  // Convert pilot hours to a score (5000+ hours = 100)
  const pilotScore = Math.min(100, (pilotHours / 5000) * 100);
  
  // Weighted average: Engine matters most (40%), then age (30%), maintenance (20%), pilot (10%)
  const health = (engineHealth * 0.4) + (ageScore * 0.3) + (maintenanceScore * 0.2) + (pilotScore * 0.1);
  
  return Math.round(health);
}

export function getRating(health) {
  if (health >= 85) {
    return { text: "Excellent", color: "#22c55e", emoji: "🟢", bgColor: "#dcfce7" };
  }
  if (health >= 70) {
    return { text: "Good", color: "#eab308", emoji: "🟡", bgColor: "#fef9c3" };
  }
  if (health >= 50) {
    return { text: "Warning", color: "#f97316", emoji: "🟠", bgColor: "#ffedd5" };
  }
  return { text: "Critical", color: "#ef4444", emoji: "🔴", bgColor: "#fee2e2" };
}

export function getHealthColor(health) {
  if (health >= 85) return "#22c55e";
  if (health >= 70) return "#eab308";
  if (health >= 50) return "#f97316";
  return "#ef4444";
}