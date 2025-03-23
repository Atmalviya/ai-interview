import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="jobs-container">
      <header class="jobs-header">
        <h1>Job Postings</h1>
        <button class="create-job-btn" (click)="showJobForm = true">
          Create New Job
        </button>
      </header>

      <div class="job-form" *ngIf="showJobForm">
        <h2>Create New Job Posting</h2>
        <form (submit)="createJob($event)">
          <div class="form-group">
            <label for="title">Job Title</label>
            <input 
              type="text" 
              id="title" 
              [(ngModel)]="newJob.title" 
              name="title" 
              required
            >
          </div>

          <div class="form-group">
            <label for="description">Job Description</label>
            <textarea 
              id="description" 
              [(ngModel)]="newJob.description" 
              name="description" 
              rows="5" 
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="requirements">Requirements</label>
            <textarea 
              id="requirements" 
              [(ngModel)]="newJob.requirements" 
              name="requirements" 
              rows="3" 
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="showJobForm = false">
              Cancel
            </button>
            <button type="submit" class="submit-btn">
              Create Job
            </button>
          </div>
        </form>
      </div>

      <div class="jobs-list">
        <div class="job-card" *ngFor="let job of jobs">
          <h3>{{ job.title }}</h3>
          <p class="job-description">{{ job.description }}</p>
          <div class="job-requirements">
            <h4>Requirements:</h4>
            <p>{{ job.requirements }}</p>
          </div>
          <div class="job-actions">
            <button class="schedule-btn" (click)="scheduleInterview(job)">
              Schedule Interview
            </button>
            <button class="edit-btn">Edit</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jobs-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .jobs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        color: #333;
        margin: 0;
      }
    }

    .create-job-btn {
      padding: 0.8rem 1.5rem;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #1976D2;
      }
    }

    .job-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;

      h2 {
        margin: 0 0 1.5rem;
        color: #333;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }

      input, textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #2196F3;
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .cancel-btn {
      padding: 0.8rem 1.5rem;
      background: #f5f5f5;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #e0e0e0;
      }
    }

    .submit-btn {
      padding: 0.8rem 1.5rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #43A047;
      }
    }

    .jobs-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .job-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      h3 {
        margin: 0 0 1rem;
        color: #333;
      }

      .job-description {
        color: #666;
        margin-bottom: 1rem;
      }

      .job-requirements {
        margin-bottom: 1.5rem;

        h4 {
          color: #333;
          margin: 0 0 0.5rem;
        }

        p {
          color: #666;
          margin: 0;
        }
      }

      .job-actions {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .schedule-btn {
          background: #4CAF50;
          color: white;

          &:hover {
            background: #43A047;
          }
        }

        .edit-btn {
          background: #f5f5f5;

          &:hover {
            background: #e0e0e0;
          }
        }
      }
    }
  `]
})
export class JobsComponent {
  showJobForm = false;
  newJob = {
    title: '',
    description: '',
    requirements: ''
  };

  jobs = [
    {
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced Frontend Developer...',
      requirements: '5+ years of experience with modern JavaScript frameworks'
    },
    // Add more sample jobs as needed
  ];

  createJob(event: Event) {
    event.preventDefault();
    this.jobs.unshift({ ...this.newJob });
    this.newJob = { title: '', description: '', requirements: '' };
    this.showJobForm = false;
  }

  scheduleInterview(job: any) {
    // Implement interview scheduling logic
    console.log('Schedule interview for:', job);
  }
} 