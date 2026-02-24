import Skill from '../models/Skill.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY is missing in environment variables" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are an expert technical interviewer simulating a high-pressure interview for a candidate. 
Generate exactly 3 adaptive recall questions for the skill: "${targetSkillName}" at a "${difficulty}" difficulty level.

The questions should be scenario-based where possible to test deep understanding, not just trivia.

Output your response strictly as a JSON array of objects. Do not include any markdown formatting (like \`\`\`json), just the raw JSON.
Each object must have the following structure:
{
  "question": "The interview question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": <integer from 0 to 3>,
  "explanation": "A concise explanation of why the correct option is best",
  "expectedConcepts": ["Core Concept 1", "Core Concept 2", "Core Concept 3"]
}
`;

        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();

        // Strip markdown backticks if Gemini includes them
        if (textResponse.startsWith('```')) {
            textResponse = textResponse.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
        }

        const generatedQuestions = JSON.parse(textResponse);

        return res.json({
            skill: targetSkillName,
            difficulty,
            questions: generatedQuestions
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate questions. Ensure Gemini API key is valid.' });
    }
};
