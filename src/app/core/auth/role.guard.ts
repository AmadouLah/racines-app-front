import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { authStore } from '../store/auth.store';
import { Role } from '../../shared/models';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const store = authStore;

    if (!store.isAuthenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const userRole = store.role();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    router.navigate(['/forbidden']);
    return false;
  };
};
