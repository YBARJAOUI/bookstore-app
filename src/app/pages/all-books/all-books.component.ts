import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book, Order } from '../../models/book.model';
import { TotalPricePipe } from '../../pipes/total-price.pipe';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-all-books',
  standalone: true,
  imports: [CommonModule, FormsModule, TotalPricePipe],
  templateUrl: './all-books.component.html',
  styleUrl: './all-books.component.css'
})
export class AllBooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  selectedBooks: Book[] = [];
  searchQuery = '';
  selectedCategory = 'all';
  showOrderModal = false;
  customerName = '';
  customerPhone = '';
  loading = false;
  error = '';
  
  private destroy$ = new Subject<void>();
  
  categories = [
    { value: 'all', label: 'Tous' },
    { value: 'FICTION', label: 'Fiction' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'DEV', label: 'Développement personnel' },
    { value: 'KIDS', label: 'Jeunesse' }
  ];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
    
    this.bookService.selectedBooks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(books => {
        this.selectedBooks = books;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooks() {
    this.loading = true;
    this.error = '';
    
    if (this.selectedCategory === 'all') {
      this.bookService.getActiveBooks()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (books) => {
            this.books = books;
            this.applyFilters();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Erreur lors du chargement des livres';
            this.loading = false;
          }
        });
    } else {
      this.bookService.getBooksByCategory(this.selectedCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (books) => {
            this.books = books;
            this.applyFilters();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Erreur lors du chargement des livres';
            this.loading = false;
          }
        });
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.bookService.searchBooks(this.searchQuery)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (books) => {
            this.filteredBooks = books;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Erreur lors de la recherche';
            this.loading = false;
          }
        });
    } else {
      this.applyFilters();
    }
  }

  onCategoryChange() {
    this.loadBooks();
  }

  private applyFilters() {
    this.filteredBooks = this.books;
    if (this.searchQuery.trim()) {
      const searchTerm = this.searchQuery.toLowerCase();
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
      );
    }
  }

  toggleBookSelection(book: Book) {
    if (this.isBookSelected(book)) {
      this.bookService.removeFromSelectedBooks(book.id);
    } else {
      this.bookService.addToSelectedBooks(book);
    }
  }

  isBookSelected(book: Book): boolean {
    return this.selectedBooks.some(b => b.id === book.id);
  }

  openOrderModal() {
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.customerName = '';
    this.customerPhone = '';
  }

  submitOrder() {
    if (!this.customerName || !this.customerPhone) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    const order: Order = {
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      books: this.selectedBooks,
      totalPrice: this.selectedBooks.reduce((total, book) => total + book.price, 0),
      orderDate: new Date()
    };

    this.loading = true;
    this.bookService.submitOrder(order)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.bookService.clearSelectedBooks();
          this.closeOrderModal();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la soumission de la commande';
          this.loading = false;
        }
      });
  }
}
