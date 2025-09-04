import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PacksComponent } from './pages/packs/packs.component';
import { AllBooksComponent } from './pages/all-books/all-books.component';
import { OffersComponent } from './pages/offers/offers.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'packs', component: PacksComponent },
  { path: 'all-books', component: AllBooksComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
