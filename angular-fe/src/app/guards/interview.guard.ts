import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

export const interviewGuard = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const id = route.params['id'];

  // Add your validation logic here
  if (!id || id.length <= 2) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
}; 