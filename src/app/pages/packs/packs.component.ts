import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Pack } from '../../models/book.model';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './packs.component.html',
  styleUrl: './packs.component.css'
})
export class PacksComponent implements OnInit {
  packs: Pack[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.packs = this.bookService.getPacks();
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
