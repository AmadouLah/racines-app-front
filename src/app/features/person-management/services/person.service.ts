import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { Person, PersonCreate, FamilyTree } from '../../../shared/models';
import { ApiResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly http = inject(HttpClient);

  getPersonById(id: string): Observable<Person> {
    return this.http.get<ApiResponse<Person>>(`${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PERSONS.BY_ID(id)}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la récupération de la personne');
      })
    );
  }

  getFamilyTree(personId: string): Observable<FamilyTree> {
    return this.http.get<ApiResponse<FamilyTree>>(`${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PERSONS.FAMILY_TREE(personId)}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la récupération de l\'arbre généalogique');
      })
    );
  }

  getPublicTree(): Observable<FamilyTree | null> {
    return this.http.get<ApiResponse<FamilyTree>>(`${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PERSONS.PUBLIC_TREE}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      })
    );
  }

  createPerson(person: PersonCreate): Observable<Person> {
    return this.http.post<ApiResponse<Person>>(`${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PERSONS.BASE}`, person).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la création de la personne');
      })
    );
  }

  updatePerson(id: string, person: Partial<Person>): Observable<Person> {
    return this.http.put<ApiResponse<Person>>(`${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PERSONS.BY_ID(id)}`, person).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erreur lors de la mise à jour de la personne');
      })
    );
  }

  exportFamilyTree(personId: string): Observable<Blob> {
    return this.http.get(`${API_ENDPOINTS.API_BASE_URL}${API_ENDPOINTS.PERSONS.EXPORT(personId)}`, {
      responseType: 'blob'
    });
  }
}
