import Skill from '../models/Skill.js';

export const generateQuestions = async (req, res) => {
    try {
        const { skillId, skillName, difficulty = 'Intermediate' } = req.body;

        let targetSkillName = skillName;

        // specific skill lookup if ID provided
        if (skillId) {
            const skill = await Skill.findById(skillId);
            if (skill) {
                targetSkillName = skill.title;
            }
        }

        if (!targetSkillName) {
            return res.status(400).json({ message: 'Skill name or ID is required' });
        }

        // SIMULATED AI LATENCY
        await new Promise(resolve => setTimeout(resolve, 1500));

        // MOCK AI RESPONSE GENERATOR
        // In a real app, this would call OpenAI/Gemini API with the prompt:
        // "Generate 3 adaptive recall questions for {targetSkillName} at {difficulty} level..."

        const mockQuestions = [
            {
                question: `Explaining the core concept of ${targetSkillName}: Which statement best describes its primary function?`,
                options: [
                    `It optimizes database queries for faster retrieval.`,
                    `It functionality ensures modularity and reusability.`, // Generic positive answer
                    `It is a legacy method replaced by newer frameworks.`,
                    `It is primarily used for frontend styling.`
                ],
                correctIndex: 1,
                explanation: `At an ${difficulty} level, understanding the modular nature of ${targetSkillName} is validating its primary architectural benefit.`
            },
            {
                question: `Scenario: You encounter an edge case in ${targetSkillName} where performance drops. What is the most likely cause?`,
                options: [
                    `Memory leaks due to unclosed listeners.`, // Plausible technical answer
                    `The server is restarting automatically.`,
                    `CSS conflicts in the global namespace.`,
                    `Incorrect API versioning.`
                ],
                correctIndex: 0,
                explanation: `Performance drops in ${targetSkillName} are frequently associated with resource management issues like memory leaks.`
            },
            {
                question: `When implementing ${targetSkillName}, which practice ensures the best long-term maintainability?`,
                options: [
                    `Hardcoding configuration values for speed.`,
                    `Using strict type checking and documentation.`, // Best practice
                    `Avoiding external dependencies entirely.`,
                    `Writing all logic in a single file.`
                ],
                correctIndex: 1,
                explanation: `For ${difficulty} users, adhering to strict typing and documentation is crucial for scaling ${targetSkillName} projects.`
            }
        ];

        return res.json({
            skill: targetSkillName,
            difficulty,
            questions: mockQuestions
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate questions' });
    }
};
