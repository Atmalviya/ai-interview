import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Interview {
  id: string;
  position: string;
  candidate: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Interview Dashboard</h1>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Upcoming Interviews</h3>
          <div class="stat-number">5</div>
        </div>
        <div class="stat-card">
          <h3>Active Jobs</h3>
          <div class="stat-number">8</div>
        </div>
        <div class="stat-card">
          <h3>Candidates</h3>
          <div class="stat-number">24</div>
        </div>
      </div>

      <div class="actions-panel">
        <button routerLink="/jobs" class="action-button">
          Post New Job
        </button>
        <button class="action-button">
          Schedule Interview
        </button>
      </div>

      <div class="upcoming-interviews">
        <h2>Upcoming Interviews</h2>
        <div class="interview-list">
          @for(interview of upcomingInterviews; track interview.id) {
            <div class="interview-item">
              <div class="interview-info">
                <h4>{{ interview.position }}</h4>
                <p>{{ interview.candidate }} - {{ interview.time }}</p>
              </div>
              <button 
                class="join-button" 
                (click)="joinInterview(interview.id)"
              >
                Join
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
      h1 {
        color: #333;
        font-size: 2rem;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      h3 {
        color: #666;
        margin: 0 0 1rem;
      }

      .stat-number {
        font-size: 2rem;
        color: #2196F3;
        font-weight: bold;
      }
    }

    .actions-panel {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .action-button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 4px;
      background: #2196F3;
      color: white;
      cursor: pointer;
      font-weight: 500;

      &:hover {
        background: #1976D2;
      }
    }

    .upcoming-interviews {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      h2 {
        color: #333;
        margin: 0 0 1.5rem;
      }
    }

    .interview-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .interview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;

      .interview-info {
        h4 {
          margin: 0;
          color: #333;
        }
        p {
          margin: 0.5rem 0 0;
          color: #666;
        }
      }

      .join-button {
        padding: 0.5rem 1rem;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background: #43A047;
        }
      }
    }
  `]
})
export class DashboardComponent {
  upcomingInterviews: Interview[] = [
    {
      id: '123',
      position: 'Frontend Developer',
      candidate: 'John Doe',
      time: 'Today at 2:00 PM'
    },
    {
      id: '124',
      position: 'Backend Developer',
      candidate: 'Jane Smith',
      time: 'Today at 3:30 PM'
    }
  ];

  constructor(private router: Router) {}

  joinInterview(id: string) {
    this.router.navigate(['/interview', id]);
  }
} 