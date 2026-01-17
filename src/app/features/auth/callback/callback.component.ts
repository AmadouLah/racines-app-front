import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/http/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule, MatCardModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.handleCallback();
  }

  private handleCallback(): void {
    this.apiService.get(API_ENDPOINTS.AUTH.SUCCESS).pipe(
      catchError(() => {
        this.error = 'Erreur lors de l\'authentification';
        this.loading = false;
        this.authService.handleAuthFailure();
        return of(null);
      })
    ).subscribe(response => {
      this.loading = false;
      if (response?.success) {
        this.authService.handleAuthSuccess(response);
      } else {
        this.error = response?.error || 'Erreur lors de l\'authentification';
        this.authService.handleAuthFailure();
      }
    });
  }
}
