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
import { ClaimService } from '../services/claim.service';
import { ProfileClaim, ClaimStatus } from '../../../shared/models';
import { LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';
import { authStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-claim-list',
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
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.css'
})
export class ClaimListComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  claims: ProfileClaim[] = [];
  displayedColumns: string[] = ['person', 'requester', 'status', 'createdAt', 'actions'];
  loading = true;
  error: string | null = null;
  readonly store = authStore;
  readonly ClaimStatus = ClaimStatus;
  selectedStatus: ClaimStatus | undefined = undefined;

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(status?: ClaimStatus): void {
    this.loading = true;
    this.error = null;
    this.selectedStatus = status;

    this.claimService.getClaims(status).pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors du chargement des revendications';
        this.loading = false;
        return of([]);
      })
    ).subscribe(claims => {
      this.claims = claims;
      this.loading = false;
    });
  }

  getStatusColor(status: ClaimStatus): string {
    switch (status) {
      case ClaimStatus.PENDING:
        return 'warn';
      case ClaimStatus.APPROVED:
        return 'primary';
      case ClaimStatus.REJECTED:
        return '';
      default:
        return '';
    }
  }

  getStatusLabel(status: ClaimStatus): string {
    switch (status) {
      case ClaimStatus.PENDING:
        return 'En attente';
      case ClaimStatus.APPROVED:
        return 'Approuvé';
      case ClaimStatus.REJECTED:
        return 'Rejeté';
      default:
        return status;
    }
  }

  approveClaim(claim: ProfileClaim): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approuver la revendication',
        message: `Voulez-vous approuver la revendication de ${claim.prenom} ${claim.nom} ?`,
        confirmText: 'Approuver',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.claimService.approveClaim(claim.id).pipe(
          catchError(error => {
            this.snackBar.open(error.message || 'Erreur lors de l\'approbation', 'Fermer', {
              duration: 3000
            });
            return of(null);
          })
        ).subscribe(updatedClaim => {
          if (updatedClaim) {
            this.snackBar.open('Revendication approuvée avec succès', 'Fermer', {
              duration: 3000
            });
            this.loadClaims(this.selectedStatus);
          }
        });
      }
    });
  }

  rejectClaim(claim: ProfileClaim): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rejeter la revendication',
        message: `Voulez-vous rejeter la revendication de ${claim.prenom} ${claim.nom} ?`,
        confirmText: 'Rejeter',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.claimService.rejectClaim(claim.id).pipe(
          catchError(error => {
            this.snackBar.open(error.message || 'Erreur lors du rejet', 'Fermer', {
              duration: 3000
            });
            return of(null);
          })
        ).subscribe(updatedClaim => {
          if (updatedClaim) {
            this.snackBar.open('Revendication rejetée', 'Fermer', {
              duration: 3000
            });
            this.loadClaims(this.selectedStatus);
          }
        });
      }
    });
  }
}
