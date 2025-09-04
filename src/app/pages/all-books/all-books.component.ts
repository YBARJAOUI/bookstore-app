import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { Book, BookFilterRequest, SimpleOrderRequest, OrderItem } from '../../models/book.model';
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
  
  // Filtres
  searchQuery = '';
  selectedCategory = 'all';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedAuthor = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Modal de commande
  showOrderModal = false;
  customerFirstName = '';
  customerLastName = '';
  customerEmail = '';
  customerPhone = '';
  customerAddress = '';
  orderNotes = '';
  
  // États
  loading = false;
  error = '';
  orderSuccess = false;
  
  private destroy$ = new Subject<void>();
  
  categories = [
    { value: 'all', label: 'Tous' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'développement', label: 'Développement' },
    { value: 'business', label: 'Business' },
    { value: 'jeunesse', label: 'Jeunesse' },
    { value: 'science', label: 'Science' },
    { value: 'histoire', label: 'Histoire' }
  ];

  constructor(
    private bookService: BookService,
    private orderService: OrderService
  ) {}

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
    
    const filters: BookFilterRequest = {
      keyword: this.searchQuery || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      page: this.currentPage,
      size: this.pageSize
    };
    
    // Si une catégorie spécifique est sélectionnée, on utilise la recherche par mot-clé
    if (this.selectedCategory !== 'all') {
      filters.keyword = this.selectedCategory;
    }
    
    this.bookService.getBooksWithPagination(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.books = response.content || response;
          this.totalPages = response.totalPages || 0;
          this.totalElements = response.totalElements || this.books.length;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          // Fallback vers l'ancienne méthode si la pagination ne fonctionne pas
          this.bookService.getAvailableBooks()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (books) => {
                this.books = books;
                this.applyFilters();
                this.loading = false;
              },
              error: (fallbackErr) => {
                this.error = 'Erreur lors du chargement des livres';
                this.loading = false;
              }
            });
        }
      });
  }

  onSearch() {
    this.currentPage = 0; // Reset à la première page lors d'une recherche
    this.loadBooks();
  }
  
  onPriceFilter() {
    this.currentPage = 0;
    this.loadBooks();
  }
  
  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedAuthor = '';
    this.currentPage = 0;
    this.loadBooks();
  }

  onCategoryChange() {
    this.loadBooks();
  }

  private applyFilters() {
    this.filteredBooks = this.books.filter(book => {
      // Filtre par recherche textuelle
      if (this.searchQuery.trim()) {
        const searchTerm = this.searchQuery.toLowerCase();
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            (book.description && book.description.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }
      
      // Filtre par auteur
      if (this.selectedAuthor.trim()) {
        const authorTerm = this.selectedAuthor.toLowerCase();
        if (!book.author.toLowerCase().includes(authorTerm)) return false;
      }
      
      // Filtre par prix
      if (this.minPrice !== null && book.price < this.minPrice) return false;
      if (this.maxPrice !== null && book.price > this.maxPrice) return false;
      
      return true;
    });
  }
  
  // Pagination
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
    }
  }
  
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
    }
  }
  
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBooks();
    }
  }
  
  get displayedPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
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
    this.customerFirstName = '';
    this.customerLastName = '';
    this.customerEmail = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.orderNotes = '';
    this.error = '';
    this.orderSuccess = false;
  }

  submitOrder() {
    // Validation des champs obligatoires
    if (!this.customerFirstName || !this.customerLastName || 
        !this.customerEmail || !this.customerPhone || !this.customerAddress) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    
    if (!this.selectedBooks.length) {
      this.error = 'Veuillez sélectionner au moins un livre';
      return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customerEmail)) {
      this.error = 'Veuillez saisir une adresse email valide';
      return;
    }
    
    // Préparation de la commande
    const orderItems: { bookId: number, quantity: number }[] = this.selectedBooks.map(book => ({
      bookId: book.id!,
      quantity: 1 // Par défaut, quantité 1 pour chaque livre
    }));
    
    const orderRequest: SimpleOrderRequest = {
      firstName: this.customerFirstName,
      lastName: this.customerLastName,
      email: this.customerEmail,
      phoneNumber: this.customerPhone,
      address: this.customerAddress,
      items: orderItems,
      notes: this.orderNotes || undefined
    };
    
    this.loading = true;
    this.error = '';
    
    this.orderService.createSimpleOrder(orderRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.orderSuccess = true;
          this.bookService.clearSelectedBooks();
          this.loading = false;
          
          // Fermer la modal après 2 secondes
          setTimeout(() => {
            this.closeOrderModal();
          }, 2000);
        },
        error: (err) => {
          console.error('Erreur lors de la commande:', err);
          this.error = err.error?.message || 'Erreur lors de la soumission de la commande';
          this.loading = false;
        }
      });
  }
  
  // Méthodes utilitaires
  getTotalPrice(): number {
    return this.selectedBooks.reduce((total, book) => total + book.price, 0);
  }
  
  getUniqueAuthors(): string[] {
    const authors = [...new Set(this.books.map(book => book.author))];
    return authors.sort();
  }
}
