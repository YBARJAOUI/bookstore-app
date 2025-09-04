import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactInfo = [
    { icon: '📍', label: 'Adresse', value: 'Casablanca, Maroc' },
    { icon: '📞', label: 'Téléphone', value: '+212 6 12 34 56 78' },
    { icon: '✉️', label: 'Email', value: 'hello@pagewave.ma' },
    { icon: '🕒', label: 'Horaires', value: 'Lun-Ven: 9h-18h' }
  ];
}
