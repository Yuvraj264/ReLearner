import { useParams, useNavigate } from "react-router-dom";
import { useSkills } from "../../../context/SkillContext";

const RecallSession = () => {
  const { skillId } = useParams();
  const { completeRecall } = useSkills();
  const navigate = useNavigate();

  const submit = async score => {
    await completeRecall(skillId, score);
    navigate(-1);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-white">
      <h2 className="text-xl font-semibold">Quick Recall</h2>
      <p className="text-gray-400 mt-2">
        Answer quickly to maintain retention.
      </p>

      <div className="mt-6 space-x-3">
        <button
          onClick={() => submit(1)}
          className="px-4 py-2 bg-cyan-500 text-black rounded"
        >
          I remembered
        </button>
        <button
          onClick={() => submit(0)}
          className="px-4 py-2 bg-neutral-800 rounded"
        >
          I forgot
        </button>
      </div>
    </div>
  );
};

export default RecallSession;
