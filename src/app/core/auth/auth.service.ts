import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { ApiService } from '../http/api.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { User } from '../../shared/models';
import { authStore } from '../store/auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly store = authStore;

  constructor() {
    this.loadCurrentUser();
  }

  getCurrentUser(): Observable<User | null> {
    return this.apiService.get<Record<string, any>>(API_ENDPOINTS.AUTH.ME).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapToUser(response.data);
        }
        return null;
      }),
      tap(user => {
        if (user) {
          this.store.setUser(user);
        } else {
          this.store.clearUser();
        }
      }),
      catchError(() => {
        this.store.clearUser();
        return of(null);
      })
    );
  }

  loadCurrentUser(): void {
    this.getCurrentUser().subscribe();
  }

  login(): void {
    window.location.href = `${API_ENDPOINTS.BACKEND_BASE_URL}/oauth2/authorization/google`;
  }

  logout(): void {
    this.store.clearUser();
    this.router.navigate(['/login']);
  }

  handleAuthSuccess(response: any): void {
    if (response.success && response.data) {
      const user = this.mapToUser(response.data);
      this.store.setUser(user);
      
      if (user.role === 'SUPER_ADMIN' || user.role === 'VALIDATED_USER') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/pending']);
      }
    }
  }

  handleAuthFailure(): void {
    this.store.clearUser();
    this.router.navigate(['/login']);
  }

  private mapToUser(data: Record<string, any>): User {
    return {
      id: data['id'],
      email: data['email'],
      nom: data['nom'],
      prenom: data['prenom'],
      dateNaissance: data['dateNaissance'],
      role: data['role'] as any,
      personId: data['personId'],
      oauth2ProviderId: data['oauth2ProviderId']
    };
  }
}
