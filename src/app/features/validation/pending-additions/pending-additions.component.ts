import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ValidationService } from '../services/validation.service';
import { PersonService } from '../../person-management/services/person.service';
import { PendingAddition, ValidationStatus } from '../../../shared/models';
import { Person } from '../../../shared/models';
import { LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent } from '../../../shared/components';
import { catchError, of, forkJoin } from 'rxjs';
import { authStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-pending-additions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DatePipe
  ],
  templateUrl: './pending-additions.component.html',
  styleUrl: './pending-additions.component.css'
})
export class PendingAdditionsComponent implements OnInit {
  private readonly validationService = inject(ValidationService);
  private readonly personService = inject(PersonService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  pendingAdditions: PendingAddition[] = [];
  persons: Map<string, Person> = new Map();
  displayedColumns: string[] = ['person', 'requester', 'status', 'createdAt', 'actions'];
  loading = true;
  error: string | null = null;
  readonly store = authStore;
  readonly ValidationStatus = ValidationStatus;

  ngOnInit(): void {
    this.loadPendingAdditions();
  }

  loadPendingAdditions(): void {
    this.loading = true;
    this.error = null;

    this.validationService.getPendingValidations().pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors du chargement des validations';
        this.loading = false;
        return of([]);
      })
    ).subscribe(additions => {
      this.pendingAdditions = additions;
      
      // Charger les informations des personnes
      const personIds = [...new Set(additions.map(a => a.personId))];
      const personRequests = personIds.map(id => 
        this.personService.getPersonById(id).pipe(
          catchError(() => of(null))
        )
      );

      forkJoin(personRequests).subscribe(persons => {
        persons.forEach((person, index) => {
          if (person) {
            this.persons.set(personIds[index], person);
          }
        });
        this.loading = false;
      });
    });
  }

  getStatusColor(status: ValidationStatus): string {
    switch (status) {
      case ValidationStatus.PENDING:
        return 'warn';
      case ValidationStatus.APPROVED:
        return 'primary';
      case ValidationStatus.REJECTED:
        return '';
      default:
        return '';
    }
  }

  getStatusLabel(status: ValidationStatus): string {
    switch (status) {
      case ValidationStatus.PENDING:
        return 'En attente';
      case ValidationStatus.APPROVED:
        return 'Approuvé';
      case ValidationStatus.REJECTED:
        return 'Rejeté';
      default:
        return status;
    }
  }

  getPersonName(personId: string): string {
    const person = this.persons.get(personId);
    return person ? `${person.prenom} ${person.nom}` : personId;
  }

  approveAddition(addition: PendingAddition): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approuver l\'ajout',
        message: `Voulez-vous approuver l'ajout de cette personne ?`,
        confirmText: 'Approuver',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validationService.approveAddition(addition.id).pipe(
          catchError(error => {
            this.snackBar.open(error.message || 'Erreur lors de l\'approbation', 'Fermer', {
              duration: 3000
            });
            return of(null);
          })
        ).subscribe(updated => {
          if (updated) {
            this.snackBar.open('Ajout approuvé avec succès', 'Fermer', {
              duration: 3000
            });
            this.loadPendingAdditions();
          }
        });
      }
    });
  }

  rejectAddition(addition: PendingAddition): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rejeter l\'ajout',
        message: `Voulez-vous rejeter l'ajout de cette personne ?`,
        confirmText: 'Rejeter',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validationService.rejectAddition(addition.id).pipe(
          catchError(error => {
            this.snackBar.open(error.message || 'Erreur lors du rejet', 'Fermer', {
              duration: 3000
            });
            return of(null);
          })
        ).subscribe(updated => {
          if (updated) {
            this.snackBar.open('Ajout rejeté', 'Fermer', {
              duration: 3000
            });
            this.loadPendingAdditions();
          }
        });
      }
    });
  }
}
