import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { PendingAddition, ValidationRequest } from '../../../shared/models';
import { ApiResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly http = inject(HttpClient);

  requestValidation(request: ValidationRequest): Observable<PendingAddition> {
    return this.http.post<ApiResponse<PendingAddition>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.VALIDATIONS.REQUEST}`,
      request
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la création de la demande de validation');
      })
    );
  }

  getPendingValidations(): Observable<PendingAddition[]> {
    return this.http.get<ApiResponse<PendingAddition[]>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.VALIDATIONS.PENDING}`
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la récupération des validations en attente');
      })
    );
  }

  getPendingAdditionById(id: string): Observable<PendingAddition> {
    return this.http.get<ApiResponse<PendingAddition>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.VALIDATIONS.BY_ID(id)}`
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la récupération de la validation');
      })
    );
  }

  approveAddition(id: string): Observable<PendingAddition> {
    return this.http.put<ApiResponse<PendingAddition>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.VALIDATIONS.APPROVE(id)}`,
      {}
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de l\'approbation de l\'ajout');
      })
    );
  }

  rejectAddition(id: string, reason?: string): Observable<PendingAddition> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }

    return this.http.put<ApiResponse<PendingAddition>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.VALIDATIONS.REJECT(id)}`,
      {},
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors du rejet de l\'ajout');
      })
    );
  }
}
