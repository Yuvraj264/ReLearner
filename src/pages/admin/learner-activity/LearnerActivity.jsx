import { useEffect, useState } from "react";
import { fetchSkillTimeline } from "../../../services/adminService";

const LearnerActivity = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchSkillTimeline().then(setEvents);
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold">Skill Activity Timeline</h2>

      <div className="mt-6 space-y-2">
        {events.map(e => (
          <div key={e._id} className="bg-neutral-900 p-3 rounded">
            <span className="text-gray-300">{e.action}</span>
            <span className="text-gray-500 text-sm ml-2">
              {new Date(e.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnerActivity;
