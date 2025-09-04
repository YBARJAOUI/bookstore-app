import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Pack } from '../../models/book.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './packs.component.html',
  styleUrl: './packs.component.css'
})
export class PacksComponent implements OnInit, OnDestroy {
  packs: Pack[] = [];
  loading = false;
  error = '';
  
  private destroy$ = new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadPacks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPacks() {
    this.loading = true;
    this.error = '';
    
    this.bookService.getActivePacks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (packs) => {
          this.packs = packs;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des packs';
          this.loading = false;
          console.error('Erreur packs:', err);
        }
      });
  }

  getBadgeClass(badge?: string): string {
    if (!badge) return 'badge';
    switch (badge) {
      case 'HOT': return 'badge hot';
      case 'NEW': return 'badge new';
      case 'SALE': return 'badge sale';
      case 'POPULAR': return 'badge popular';
      default: return 'badge';
    }
  }

  getBadgeText(badge?: string): string {
    if (!badge) return '';
    switch (badge) {
      case 'HOT': return 'HOT';
      case 'NEW': return 'Nouveau';
      case 'SALE': return 'Promo';
      case 'POPULAR': return 'Populaire';
      default: return badge;
    }
  }
}
