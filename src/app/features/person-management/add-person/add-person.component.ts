import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PersonService } from '../services/person.service';
import { ValidationService } from '../../validation/services/validation.service';
import { PersonCreate, Person } from '../../../shared/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '../../../shared/components';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-add-person',
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
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './add-person.component.html',
  styleUrl: './add-person.component.css'
})
export class AddPersonComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly validationService = inject(ValidationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  personForm!: FormGroup;
  loading = false;
  error: string | null = null;
  isLinear = true;
  requestValidation = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.personForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      lieuNaissance: [''],
      metadata: ['']
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      this.loading = true;
      this.error = null;

      const personData: PersonCreate = {
        nom: this.personForm.value.nom,
        prenom: this.personForm.value.prenom,
        dateNaissance: this.personForm.value.dateNaissance,
        lieuNaissance: this.personForm.value.lieuNaissance || undefined,
        metadata: this.personForm.value.metadata || undefined
      };

      this.personService.createPerson(personData).pipe(
        catchError(error => {
          this.error = error.message || 'Erreur lors de la création de la personne';
          this.loading = false;
          return of(null);
        })
      ).subscribe(person => {
        if (person) {
          if (this.requestValidation) {
            this.requestValidationForPerson(person.id);
          } else {
            this.loading = false;
            this.snackBar.open('Personne créée avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/persons', person.id]);
          }
        }
      });
    }
  }

  private requestValidationForPerson(personId: string): void {
    this.validationService.requestValidation({ personId }).pipe(
      catchError(error => {
        this.error = error.message || 'Erreur lors de la demande de validation';
        this.loading = false;
        return of(null);
      })
    ).subscribe(validation => {
      this.loading = false;
      if (validation) {
        this.snackBar.open('Personne créée et demande de validation envoyée', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/validations']);
      }
    });
  }
}
