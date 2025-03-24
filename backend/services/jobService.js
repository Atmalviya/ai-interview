const Job = require('../models/job');

class JobService {
  async createJob(jobData) {
    try {
      const job = await Job.create(jobData);
      return job;
    } catch (error) {
      throw new Error(`Error creating job: ${error.message}`);
    }
  }

  async getAllJobs() {
    try {
      const jobs = await Job.findAll({
        order: [['createdAt', 'DESC']]
      });
      return jobs;
    } catch (error) {
      throw new Error(`Error fetching jobs: ${error.message}`);
    }
  }

  async getJobById(id) {
    try {
      const job = await Job.findByPk(id);
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    } catch (error) {
      throw new Error(`Error fetching job: ${error.message}`);
    }
  }

  async updateJob(id, jobData) {
    try {
      const job = await Job.findByPk(id);
      if (!job) {
        throw new Error('Job not found');
      }
      await job.update(jobData);
      return job;
    } catch (error) {
      throw new Error(`Error updating job: ${error.message}`);
    }
  }

  async deleteJob(id) {
    try {
      const job = await Job.findByPk(id);
      if (!job) {
        throw new Error('Job not found');
      }
      await job.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting job: ${error.message}`);
    }
  }
}

module.exports = new JobService(); 