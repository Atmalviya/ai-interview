const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');
const jobController = require('../controllers/jobController');
const aiController = require('../controllers/aiController');

// TTS routes
router.post('/tts', ttsController.generateSpeech);

// Job routes
router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/:id', jobController.getJobById);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);

// AI routes
router.post('/generate-questions', aiController.generateQuestions);

module.exports = router;