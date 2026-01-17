import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./claim-list/claim-list.component').then(m => m.ClaimListComponent)
  },
  {
    path: 'new/:personId',
    loadComponent: () => import('./claim-profile/claim-profile.component').then(m => m.ClaimProfileComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./claim-detail/claim-detail.component').then(m => m.ClaimDetailComponent)
  }
];
