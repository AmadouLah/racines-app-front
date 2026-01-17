import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() message: string = 'Une erreur est survenue';
  @Input() showIcon: boolean = true;
}
