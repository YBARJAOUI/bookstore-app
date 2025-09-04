import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book, Pack, DailyOffer, BookFilterRequest } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://192.168.50.198:8080/api';
  private selectedBooksSubject = new BehaviorSubject<Book[]>([]);
  public selectedBooks$ = this.selectedBooksSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Livres - API calls
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/all`);
  }

  getBooksWithPagination(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/books`, { params });
  }

  getActiveBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/active`);
  }

  getAvailableBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/available`);
  }

  getFeaturedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/featured`);
  }

  searchBooks(keyword: string): Observable<Book[]> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get<Book[]>(`${this.apiUrl}/books/search`, { params });
  }

  filterBooksByPrice(minPrice: number, maxPrice: number): Observable<Book[]> {
    let params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
    return this.http.get<Book[]>(`${this.apiUrl}/books/price-range`, { params });
  }

  getBookCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/books/categories`);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  // Packs
  getAllPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/packs`);
  }

  getActivePacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/packs/active`);
  }

  getFeaturedPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/packs/featured`);
  }

  searchPacks(keyword: string): Observable<Pack[]> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get<Pack[]>(`${this.apiUrl}/packs/search`, { params });
  }

  getPacksByCategory(category: string): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/packs/category/${category}`);
  }

  getPackCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/packs/categories`);
  }

  getPackById(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/packs/${id}`);
  }

  // Offres quotidiennes
  getAllDailyOffers(): Observable<DailyOffer[]> {
    return this.http.get<DailyOffer[]>(`${this.apiUrl}/daily-offers`);
  }

  getActiveDailyOffers(): Observable<DailyOffer[]> {
    return this.http.get<DailyOffer[]>(`${this.apiUrl}/daily-offers/active`);
  }

  getCurrentDailyOffers(): Observable<DailyOffer[]> {
    return this.http.get<DailyOffer[]>(`${this.apiUrl}/daily-offers/current`);
  }

  getDailyOfferById(id: number): Observable<DailyOffer> {
    return this.http.get<DailyOffer>(`${this.apiUrl}/daily-offers/${id}`);
  }

  getDailyOffersByBook(bookId: number): Observable<DailyOffer[]> {
    return this.http.get<DailyOffer[]>(`${this.apiUrl}/daily-offers/book/${bookId}`);
  }

  getDailyOffersByPack(packId: number): Observable<DailyOffer[]> {
    return this.http.get<DailyOffer[]>(`${this.apiUrl}/daily-offers/pack/${packId}`);
  }

  isDailyOfferValid(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/daily-offers/${id}/is-valid`);
  }

  // Méthodes utilitaires pour le filtrage avancé
  filterBooks(filters: BookFilterRequest): Observable<Book[]> {
    let params = new HttpParams();
    
    if (filters.keyword) {
      params = params.set('keyword', filters.keyword);
    }
    
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }
    
    // Combiner recherche et filtrage par prix si nécessaire
    if (filters.keyword && (filters.minPrice !== undefined && filters.maxPrice !== undefined)) {
      // Faire deux requêtes et combiner les résultats côté client
      // ou implémenter un endpoint combiné sur le backend
      return this.searchBooks(filters.keyword);
    } else if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      return this.filterBooksByPrice(filters.minPrice, filters.maxPrice);
    } else if (filters.keyword) {
      return this.searchBooks(filters.keyword);
    } else {
      return this.getBooksWithPagination(filters.page || 0, filters.size || 10);
    }
  }

  // Gestion du panier
  addToSelectedBooks(book: Book) {
    const currentBooks = this.selectedBooksSubject.value;
    if (!currentBooks.find(b => b.id === book.id)) {
      this.selectedBooksSubject.next([...currentBooks, book]);
    }
  }

  removeFromSelectedBooks(bookId: number | undefined) {
    if (bookId === undefined) return;
    const currentBooks = this.selectedBooksSubject.value;
    this.selectedBooksSubject.next(currentBooks.filter(book => book.id !== bookId));
  }

  clearSelectedBooks() {
    this.selectedBooksSubject.next([]);
  }

  // Méthodes héritées pour compatibilité avec le code existant
  getBooksByCategory(category: string): Observable<Book[]> {
    return this.searchBooks(category);
  }
}