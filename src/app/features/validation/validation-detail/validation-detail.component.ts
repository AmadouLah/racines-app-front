import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ValidationService } from '../services/validation.service';
import { PersonService } from '../../person-management/services/person.service';
import { PendingAddition, ValidationStatus } from '../../../shared/models';
import { Person } from '../../../shared/models';
import { LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent } from '../../../shared/components';
import { PersonCardComponent } from '../../person-management/person-card/person-card.component';
import { catchError, of } from 'rxjs';
import { authStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-validation-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    PersonCardComponent,
    DatePipe
  ],
  templateUrl: './validation-detail.component.html',
  styleUrl: './validation-detail.component.css'
})
export class ValidationDetailComponent implements OnInit {
  private readonly validationService = inject(ValidationService);
  private readonly personService = inject(PersonService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  pendingAddition: PendingAddition | null = null;
  person: Person | null = null;
  loading = true;
  error: string | null = null;
  readonly store = authStore;
  readonly ValidationStatus = ValidationStatus;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadValidation(id);
    } else {
      this.error = 'ID de validation manquant';
      this.loading = false;
    }
  }

  private loadValidation(id: string): void {
    this.validationService.getPendingAdditionById(id).pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors du chargement de la validation';
        this.loading = false;
        return of(null);
      })
    ).subscribe(addition => {
      this.pendingAddition = addition;
      if (addition) {
        this.loadPerson(addition.personId);
      }
      this.loading = false;
    });
  }

  private loadPerson(personId: string): void {
    this.personService.getPersonById(personId).pipe(
      catchError(() => of(null))
    ).subscribe(person => {
      this.person = person;
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

  approveAddition(): void {
    if (!this.pendingAddition) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approuver l\'ajout',
        message: 'Voulez-vous approuver cet ajout ?',
        confirmText: 'Approuver',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validationService.approveAddition(this.pendingAddition!.id).pipe(
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
            this.router.navigate(['/validations']);
          }
        });
      }
    });
  }

  rejectAddition(): void {
    if (!this.pendingAddition) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rejeter l\'ajout',
        message: 'Voulez-vous rejeter cet ajout ?',
        confirmText: 'Rejeter',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validationService.rejectAddition(this.pendingAddition!.id).pipe(
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
            this.router.navigate(['/validations']);
          }
        });
      }
    });
  }
}
