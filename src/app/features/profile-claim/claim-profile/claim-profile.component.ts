import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ClaimService } from '../services/claim.service';
import { PersonService } from '../../person-management/services/person.service';
import { ProfileClaimCreate } from '../../../shared/models';
import { ErrorMessageComponent, ConfirmDialogComponent } from '../../../shared/components';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-claim-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSnackBarModule,
    ErrorMessageComponent
  ],
  templateUrl: './claim-profile.component.html',
  styleUrl: './claim-profile.component.css'
})
export class ClaimProfileComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly personService = inject(PersonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  claimForm!: FormGroup;
  personId: string | null = null;
  loading = false;
  error: string | null = null;
  isLinear = true;

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('personId');
    this.initForm();
  }

  private initForm(): void {
    this.claimForm = this.fb.group({
      personId: [this.personId, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.claimForm.valid) {
      this.loading = true;
      this.error = null;

      const claimData: ProfileClaimCreate = {
        personId: this.claimForm.value.personId,
        email: this.claimForm.value.email,
        nom: this.claimForm.value.nom,
        prenom: this.claimForm.value.prenom,
        dateNaissance: this.claimForm.value.dateNaissance
      };

      this.claimService.createClaim(claimData).pipe(
        catchError(error => {
          this.error = error.message || 'Erreur lors de la création de la revendication';
          this.loading = false;
          return of(null);
        })
      ).subscribe(claim => {
        this.loading = false;
        if (claim) {
          this.snackBar.open('Revendication créée avec succès. Un administrateur va examiner votre demande.', 'Fermer', {
            duration: 5000
          });
          this.router.navigate(['/']);
        }
      });
    }
  }
}
