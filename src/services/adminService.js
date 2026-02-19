const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {};
};

export const fetchPlatformStats = async () => {
  try {
    const res = await fetch(`${API}/admin/stats`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {}; // Return empty object to prevent crashes
  }
};

export const fetchSkillAnalytics = async () => {
  try {
    const res = await fetch(`${API}/admin/skills`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch skill analytics');
    return await res.json();
  } catch (error) {
    console.error("Error fetching skill analytics:", error);
    return []; // Return empty array to prevent map errors
  }
};

export const fetchSkillTimeline = async () => {
  try {
    const res = await fetch(`${API}/admin/timeline`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return await res.json();
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return [];
  }
};
