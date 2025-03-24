const aiService = require('../services/aiService');

class AIController {
  async generateQuestions(req, res) {
    try {
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Google API key is not configured');
      }

      const { role, seniority, technology, requirements } = req.body;
      const questions = await aiService.generateQuestions(role, seniority, technology, requirements);
      
      res.json({ questions });
    } catch (error) {
      console.error('Error generating questions:', error);
      res.status(500).json({ 
        error: error.message,
        details: 'Failed to generate questions using Gemini'
      });
    }
  }
}

module.exports = new AIController();