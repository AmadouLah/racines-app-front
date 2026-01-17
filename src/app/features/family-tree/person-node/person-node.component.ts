import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Person } from '../../../shared/models';

@Component({
  selector: 'app-person-node',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './person-node.component.html',
  styleUrl: './person-node.component.css'
})
export class PersonNodeComponent {
  @Input() person!: Person;
  @Input() isMain: boolean = false;
}
