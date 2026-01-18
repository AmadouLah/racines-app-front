import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/http/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { catchError, of } from 'rxjs';
import { ErrorMessageComponent } from '../../../shared/components';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    ErrorMessageComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  step: 'email' | 'otp' | 'password' = 'email';
  loading = false;
  error: string | null = null;
  loginType: 'otp' | 'password' | null = null;
  userEmail: string = '';
  hidePassword = true;

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Record<string, string>) => {
      if (params['error']) {
        this.error = params['error'];
        this.router.navigate([], { queryParams: {} });
      }
    });
  }

  onEmailSubmit(): void {
    if (this.emailForm.valid) {
      this.loading = true;
      this.error = null;
      this.userEmail = this.emailForm.value.email;

      this.apiService.post<{ type: string; message: string }>(API_ENDPOINTS.AUTH.LOGIN_INITIATE, { email: this.userEmail }).pipe(
        catchError(error => {
          this.error = error.error?.error || 'Erreur lors de l\'initialisation de la connexion';
          this.loading = false;
          return of(null);
        })
      ).subscribe(response => {
        this.loading = false;
        if (response?.success && response.data) {
          this.loginType = response.data.type as 'otp' | 'password';
          this.step = this.loginType === 'password' ? 'password' : 'otp';
        }
      });
    }
  }

  onOTPSubmit(): void {
    if (this.otpForm.valid) {
      this.loading = true;
      this.error = null;

      this.apiService.post<Record<string, any>>(API_ENDPOINTS.AUTH.LOGIN_VERIFY_OTP, {
        email: this.userEmail,
        otpCode: this.otpForm.value.otpCode
      }).pipe(
        catchError(error => {
          this.error = error.error?.error || 'Code OTP invalide';
          this.loading = false;
          return of(null);
        })
      ).subscribe(response => {
        this.loading = false;
        if (response?.success && response.data) {
          this.authService.handleAuthSuccess(response);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.error = null;

      this.apiService.post<Record<string, any>>(API_ENDPOINTS.AUTH.LOGIN_VERIFY_PASSWORD, {
        email: this.userEmail,
        password: this.passwordForm.value.password
      }).pipe(
        catchError(error => {
          this.error = error.error?.error || 'Mot de passe incorrect';
          this.loading = false;
          return of(null);
        })
      ).subscribe(response => {
        this.loading = false;
        if (response?.success && response.data) {
          this.authService.handleAuthSuccess(response);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  onGoogleLogin(): void {
    this.authService.login();
  }

  backToEmail(): void {
    this.step = 'email';
    this.loginType = null;
    this.error = null;
    this.otpForm.reset();
    this.passwordForm.reset();
  }

  onOtpKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}
