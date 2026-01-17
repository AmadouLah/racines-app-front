import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PersonService } from '../../person-management/services/person.service';
import { FamilyTree } from '../../../shared/models';
import { PersonCardComponent } from '../../person-management/person-card/person-card.component';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';
import { authStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-family-tree-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    PersonCardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './family-tree-view.component.html',
  styleUrl: './family-tree-view.component.css'
})
export class FamilyTreeViewComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly route = inject(ActivatedRoute);

  familyTree: FamilyTree | null = null;
  loading = true;
  error: string | null = null;
  readonly store = authStore;

  ngOnInit(): void {
    const personId = this.route.snapshot.paramMap.get('id');
    if (personId) {
      this.loadFamilyTree(personId);
    } else {
      // Si pas d'ID, utiliser l'ID de la personne de l'utilisateur connecté
      const userPersonId = this.store.user()?.personId;
      if (userPersonId) {
        this.loadFamilyTree(userPersonId);
      } else {
        this.error = 'Aucune personne associée à votre compte';
        this.loading = false;
      }
    }
  }

  private loadFamilyTree(personId: string): void {
    this.personService.getFamilyTree(personId).pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors du chargement de l\'arbre généalogique';
        this.loading = false;
        return of(null);
      })
    ).subscribe(tree => {
      this.familyTree = tree;
      this.loading = false;
    });
  }
}
