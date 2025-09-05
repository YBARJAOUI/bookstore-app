import { Routes } from '@angular/router';
import { AllBooksComponent } from './pages/all-books/all-books.component';
import { OffersComponent } from './pages/offers/offers.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: AllBooksComponent },
  { path: 'offers', component: OffersComponent },
  { path: '**', redirectTo: '/books' }
];