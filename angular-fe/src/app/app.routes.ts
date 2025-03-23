import { Routes } from '@angular/router';
import { interviewGuard } from './guards/interview.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./pages/jobs/jobs.component')
      .then(m => m.JobsComponent)
  },
  {
    path: 'interview/:id',
    canActivate: [interviewGuard],
    loadComponent: () => import('./pages/interview/interview.component')
      .then(m => m.InterviewComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
