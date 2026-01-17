import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { Role } from './shared/models';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'claims/new/:personId',
    loadComponent: () => import('./features/profile-claim/claim-profile/claim-profile.component').then(m => m.ClaimProfileComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/public-tree/public-tree.component').then(m => m.PublicTreeComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'persons/:id',
        loadComponent: () => import('./features/person-management/person-detail/person-detail.component').then(m => m.PersonDetailComponent)
      },
      {
        path: 'family-tree/:id',
        loadComponent: () => import('./features/family-tree/family-tree-view/family-tree-view.component').then(m => m.FamilyTreeViewComponent)
      },
      {
        path: 'family-tree',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'claims',
        loadChildren: () => import('./features/profile-claim/profile-claim.routes').then(m => m.routes),
        canActivate: [roleGuard([Role.SUPER_ADMIN, Role.VALIDATED_USER])]
      },
      {
        path: 'validations',
        loadChildren: () => import('./features/validation/validation.routes').then(m => m.routes),
        canActivate: [roleGuard([Role.SUPER_ADMIN, Role.VALIDATED_USER])]
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes),
        canActivate: [roleGuard([Role.SUPER_ADMIN])]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
