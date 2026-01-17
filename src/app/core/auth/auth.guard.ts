import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { authStore } from '../store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = authStore;

  if (store.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
