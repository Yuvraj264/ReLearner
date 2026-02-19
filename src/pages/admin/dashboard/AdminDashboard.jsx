import { useEffect, useState } from "react";
import { fetchPlatformStats } from "../../../services/adminService";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  const { user } = useAuth();
  // Safe-guard: Don't fetch if not admin (even if layout should handle it)
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPlatformStats().then(setStats);
    }
  }, [user]);

  if (!stats) return null;

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold">Platform Overview</h2>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-neutral-900 p-4 rounded">
          <p>Total Skills</p>
          <h3 className="text-2xl">{stats.totalSkills}</h3>
        </div>

        <div className="bg-neutral-900 p-4 rounded">
          <p>Completed</p>
          <h3 className="text-2xl">{stats.completedSkills}</h3>
        </div>

        <div className="bg-neutral-900 p-4 rounded">
          <p>At Risk</p>
          <h3 className="text-2xl">{stats.atRiskSkills}</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
