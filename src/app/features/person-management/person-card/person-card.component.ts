import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Person } from '../../../shared/models';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {
  @Input() person!: Person;
  @Input() showActions: boolean = true;
}
