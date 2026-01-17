import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { ProfileClaim, ProfileClaimCreate, ClaimStatus } from '../../../shared/models';
import { ApiResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private readonly http = inject(HttpClient);

  createClaim(claim: ProfileClaimCreate): Observable<ProfileClaim> {
    return this.http.post<ApiResponse<ProfileClaim>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PROFILE_CLAIMS.BASE}`,
      claim
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la création de la revendication');
      })
    );
  }

  getClaims(status?: ClaimStatus): Observable<ProfileClaim[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<ProfileClaim[]>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PROFILE_CLAIMS.BASE}`,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la récupération des revendications');
      })
    );
  }

  getClaimById(id: string): Observable<ProfileClaim> {
    return this.http.get<ApiResponse<ProfileClaim>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PROFILE_CLAIMS.BY_ID(id)}`
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la récupération de la revendication');
      })
    );
  }

  approveClaim(id: string): Observable<ProfileClaim> {
    return this.http.put<ApiResponse<ProfileClaim>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PROFILE_CLAIMS.APPROVE(id)}`,
      {}
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de l\'approbation de la revendication');
      })
    );
  }

  rejectClaim(id: string, reason?: string): Observable<ProfileClaim> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }

    return this.http.put<ApiResponse<ProfileClaim>>(
      `${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PROFILE_CLAIMS.REJECT(id)}`,
      {},
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors du rejet de la revendication');
      })
    );
  }
}
