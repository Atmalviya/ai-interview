const jobService = require('../services/jobService');

class JobController {
  async createJob(req, res) {
    try {
      const job = await jobService.createJob(req.body);
      res.status(201).json(job);
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllJobs(req, res) {
    try {
      const jobs = await jobService.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getJobById(req, res) {
    try {
      const job = await jobService.getJobById(req.params.id);
      res.json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateJob(req, res) {
    try {
      const job = await jobService.updateJob(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteJob(req, res) {
    try {
      await jobService.deleteJob(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JobController();