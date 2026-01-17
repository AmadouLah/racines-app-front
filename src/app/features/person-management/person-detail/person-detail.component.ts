import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonService } from '../services/person.service';
import { Person, FamilyTree } from '../../../shared/models';
import { PersonCardComponent } from '../person-card/person-card.component';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PersonCardComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DatePipe
  ],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css'
})
export class PersonDetailComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly route = inject(ActivatedRoute);

  person: Person | null = null;
  familyTree: FamilyTree | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const personId = this.route.snapshot.paramMap.get('id');
    if (personId) {
      this.loadPerson(personId);
      this.loadFamilyTree(personId);
    } else {
      this.error = 'ID de personne manquant';
      this.loading = false;
    }
  }

  private loadPerson(id: string): void {
    this.personService.getPersonById(id).pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors du chargement de la personne';
        this.loading = false;
        return of(null);
      })
    ).subscribe(person => {
      this.person = person;
      this.loading = false;
    });
  }

  private loadFamilyTree(id: string): void {
    this.personService.getFamilyTree(id).pipe(
      catchError(() => of(null))
    ).subscribe(tree => {
      this.familyTree = tree;
    });
  }
}
