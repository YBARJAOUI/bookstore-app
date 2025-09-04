import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  metrics = [
    { value: '+5k', label: 'Lecteurs satisfaits' },
    { value: '48h', label: 'Livraison moyenne' },
    { value: '4.9★', label: 'Avis clients' }
  ];
}
