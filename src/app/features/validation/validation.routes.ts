import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pending',
    pathMatch: 'full'
  },
  {
    path: 'pending',
    loadComponent: () => import('./pending-additions/pending-additions.component').then(m => m.PendingAdditionsComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./validation-detail/validation-detail.component').then(m => m.ValidationDetailComponent)
  }
];
