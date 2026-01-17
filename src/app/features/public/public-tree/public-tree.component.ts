import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonService } from '../../person-management/services/person.service';
import { FamilyTree } from '../../../shared/models';
import { PersonCardComponent } from '../../person-management/person-card/person-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';
import { authStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-public-tree',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PersonCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './public-tree.component.html',
  styleUrl: './public-tree.component.css'
})
export class PublicTreeComponent implements OnInit {
  private readonly personService = inject(PersonService);

  familyTree: FamilyTree | null = null;
  loading = true;
  readonly store = authStore;

  ngOnInit(): void {
    this.loadPublicTree();
  }

  private loadPublicTree(): void {
    this.personService.getPublicTree().pipe(
      catchError(() => {
        this.loading = false;
        this.familyTree = null;
        return of(null);
      })
    ).subscribe(response => {
      this.loading = false;
      this.familyTree = response || null;
    });
  }
}
