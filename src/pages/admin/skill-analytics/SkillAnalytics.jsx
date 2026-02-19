import { useEffect, useState } from "react";
import { fetchSkillAnalytics } from "../../../services/adminService";

const SkillAnalytics = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkillAnalytics().then((data) => {
      if (Array.isArray(data)) {
        setSkills(data);
      } else {
        console.error("Invalid skills data:", data);
        setSkills([]);
      }
    });
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold">Skill Analytics</h2>

      <div className="mt-6 space-y-3">
        {skills.map(skill => (
          <div
            key={skill.title}
            className="bg-neutral-900 p-4 rounded flex justify-between"
          >
            <span>{skill.title}</span>
            <span>{skill.health ?? "N/A"}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillAnalytics;
