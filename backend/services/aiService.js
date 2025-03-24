const fetch = require('node-fetch');
const config = require('../config');

class AIService {
  async listAvailableModels() {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${config.googleApiKey}`
      );
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  async generateQuestions(role, seniority, technology, requirements) {
    const modelName = 'gemini-2.0-flash';
    
    const prompt = `Generate 5 technical interview questions for a ${seniority} ${role} position.
    Technologies: ${technology}
    Requirements: ${requirements}
    
    The questions should be specific to the role and technologies mentioned.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': config.googleApiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}

module.exports = new AIService();