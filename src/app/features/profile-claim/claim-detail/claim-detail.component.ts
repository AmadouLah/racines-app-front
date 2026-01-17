import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClaimService } from '../services/claim.service';
import { ProfileClaim, ClaimStatus } from '../../../shared/models';
import { LoadingSpinnerComponent, ErrorMessageComponent, ConfirmDialogComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';
import { authStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-claim-detail',
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
    DatePipe
  ],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.css'
})
export class ClaimDetailComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  claim: ProfileClaim | null = null;
  loading = true;
  error: string | null = null;
  readonly store = authStore;
  readonly ClaimStatus = ClaimStatus;

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    if (claimId) {
      this.loadClaim(claimId);
    } else {
      this.error = 'ID de revendication manquant';
      this.loading = false;
    }
  }

  private loadClaim(id: string): void {
    this.claimService.getClaimById(id).pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors du chargement de la revendication';
        this.loading = false;
        return of(null);
      })
    ).subscribe(claim => {
        this.claim = claim;
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

  approveClaim(): void {
    if (!this.claim) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approuver la revendication',
        message: `Voulez-vous approuver la revendication de ${this.claim.prenom} ${this.claim.nom} ?`,
        confirmText: 'Approuver',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.claimService.approveClaim(this.claim!.id).pipe(
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
            this.router.navigate(['/claims']);
          }
        });
      }
    });
  }

  rejectClaim(): void {
    if (!this.claim) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rejeter la revendication',
        message: `Voulez-vous rejeter la revendication de ${this.claim.prenom} ${this.claim.nom} ?`,
        confirmText: 'Rejeter',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.claimService.rejectClaim(this.claim!.id).pipe(
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
            this.router.navigate(['/claims']);
          }
        });
      }
    });
  }
}
