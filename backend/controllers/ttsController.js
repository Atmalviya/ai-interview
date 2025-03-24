const fetch = require('node-fetch');

class TTSController {
  async generateSpeech(req, res) {
    try {
      if (!req.body || !req.body.text) {
        throw new Error('Missing required text parameter');
      }
      
      const response = await fetch('http://localhost:8000/api/v1/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/wav',
        },
        body: JSON.stringify({ text: req.body.text }),
      });

      if (!response.ok) {
        throw new Error(`TTS API request failed with status ${response.status}`);
      }

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Transfer-Encoding', 'chunked');
      response.body.pipe(res);

    } catch (error) {
      console.error('Error in TTS:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = new TTSController();