import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { DailyOffer, Pack } from '../../models/book.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit, OnDestroy {
  dailyOffers: DailyOffer[] = [];
  packs: Pack[] = [];
  loading = false;
  error = '';
  
  private destroy$ = new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadOffersAndPacks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOffersAndPacks() {
    this.loading = true;
    this.error = '';

    // Charger les offres quotidiennes
    this.bookService.getCurrentDailyOffers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (offers) => {
          this.dailyOffers = offers;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des offres:', err);
          this.error = 'Erreur lors du chargement des offres';
        }
      });

    // Charger les packs vedettes
    this.bookService.getFeaturedPacks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (packs) => {
          this.packs = packs;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des packs:', err);
          // Fallback vers les packs actifs
          this.bookService.getActivePacks()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (packs) => {
                this.packs = packs;
                this.loading = false;
              },
              error: (fallbackErr) => {
                this.error = 'Erreur lors du chargement des packs';
                this.loading = false;
              }
            });
        }
      });
  }

  calculateSavings(originalPrice: number, offerPrice: number): number {
    return originalPrice - offerPrice;
  }

  calculateSavingsPercentage(originalPrice: number, offerPrice: number): number {
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  }

  isOfferValid(offer: DailyOffer): boolean {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    return now >= startDate && now <= endDate;
  }

  getDaysRemaining(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
