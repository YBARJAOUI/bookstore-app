import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book, Pack, Order, Offer } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api';
  private selectedBooksSubject = new BehaviorSubject<Book[]>([]);
  public selectedBooks$ = this.selectedBooksSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Livres
  getAllBooks(): Observable<Book[]> {
    // Pour la démo, retourner des données statiques
    return new Observable(observer => {
      observer.next(this.getDemoBooks());
      observer.complete();
    });
  }

  getActiveBooks(): Observable<Book[]> {
    return new Observable(observer => {
      observer.next(this.getDemoBooks());
      observer.complete();
    });
  }

  private getDemoBooks(): Book[] {
    return [
      {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "DEV",
        price: 120,
        originalPrice: 150,
        rating: 4.8,
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
        description: "Un guide pratique pour écrire du code propre et maintenable",
        active: true,
        stock: 15
      },
      {
        id: 2,
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "BUSINESS",
        price: 89,
        originalPrice: 110,
        rating: 4.5,
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        description: "Comment innover en permanence avec succès",
        active: true,
        stock: 20
      },
      {
        id: 3,
        title: "Harry Potter à l'école des sorciers",
        author: "J.K. Rowling",
        category: "FICTION",
        price: 75,
        rating: 4.9,
        cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        description: "Le premier tome de la saga magique",
        active: true,
        stock: 30
      },
      {
        id: 4,
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        category: "KIDS",
        price: 45,
        rating: 4.7,
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
        description: "Un conte poétique et philosophique",
        active: true,
        stock: 25
      },
      {
        id: 5,
        title: "Atomic Habits",
        author: "James Clear",
        category: "DEV",
        price: 95,
        rating: 4.8,
        cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop",
        description: "Comment construire de bonnes habitudes et éliminer les mauvaises",
        active: true,
        stock: 18
      },
      {
        id: 6,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "BUSINESS",
        price: 85,
        rating: 4.6,
        cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
        description: "Leçons intemporelles sur la richesse, la cupidité et le bonheur",
        active: true,
        stock: 22
      },
      {
        id: 7,
        title: "1984",
        author: "George Orwell",
        category: "FICTION",
        price: 65,
        rating: 4.8,
        cover: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
        description: "Un classique de la dystopie",
        active: true,
        stock: 12
      },
      {
        id: 8,
        title: "Les Aventures de Tintin",
        author: "Hergé",
        category: "KIDS",
        price: 55,
        rating: 4.5,
        cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        description: "Collection complète des aventures du célèbre reporter",
        active: true,
        stock: 8
      },
      {
        id: 9,
        title: "Design Patterns",
        author: "Gang of Four",
        category: "DEV",
        price: 140,
        originalPrice: 180,
        rating: 4.7,
        cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop",
        description: "Eléments de logiciels orientés objet réutilisables",
        active: true,
        stock: 10
      },
      {
        id: 10,
        title: "Good to Great",
        author: "Jim Collins",
        category: "BUSINESS",
        price: 99,
        rating: 4.4,
        cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop",
        description: "Pourquoi certaines entreprises réussissent mieux que d'autres",
        active: true,
        stock: 16
      },
      {
        id: 11,
        title: "L'Alchimiste",
        author: "Paulo Coelho",
        category: "FICTION",
        price: 70,
        rating: 4.6,
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        description: "Un voyage initiatique vers la réalisation de ses rêves",
        active: true,
        stock: 14
      },
      {
        id: 12,
        title: "Où est Charlie?",
        author: "Martin Handford",
        category: "KIDS",
        price: 35,
        rating: 4.3,
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
        description: "Le célèbre livre-jeu de recherche",
        active: true,
        stock: 20
      }
    ];
  }

  getBooksByCategory(category: string): Observable<Book[]> {
    return new Observable(observer => {
      const books = this.getDemoBooks().filter(book => book.category === category);
      observer.next(books);
      observer.complete();
    });
  }

  searchBooks(query: string): Observable<Book[]> {
    return new Observable(observer => {
      const searchTerm = query.toLowerCase();
      const books = this.getDemoBooks().filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      );
      observer.next(books);
      observer.complete();
    });
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

  getPackById(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/packs/${id}`);
  }

  getPacks(): Pack[] {
    return [
      {
        id: 1,
        name: 'Pack Développement',
        title: 'Pack Développement',
        description: 'Les meilleurs livres pour apprendre le développement web',
        price: 299,
        originalPrice: 399,
        image: 'assets/images/pack-dev.jpg',
        active: true,
        isHighlight: true,
        badge: 'HOT',
        books: []
      },
      {
        id: 2,
        name: 'Pack Business',
        title: 'Pack Business',
        description: 'Développez votre esprit entrepreneurial',
        price: 249,
        originalPrice: 329,
        image: 'assets/images/pack-business.jpg',
        active: true,
        isHighlight: false,
        badge: 'SALE',
        books: []
      }
    ];
  }

  // Offres
  getOffers(): Offer[] {
    return [
      {
        id: 1,
        title: 'Offre Spéciale Fiction',
        description: '3 romans bestsellers à prix réduit',
        price: 89,
        originalPrice: 120,
        discount: 25,
        image: 'assets/images/offer-fiction.jpg',
        validUntil: new Date('2024-12-31'),
        active: true,
        books: []
      },
      {
        id: 2,
        title: 'Bundle Développement Personnel',
        description: 'Transformez votre vie avec cette sélection',
        price: 149,
        originalPrice: 199,
        discount: 30,
        image: 'assets/images/offer-personal.jpg',
        validUntil: new Date('2024-11-30'),
        active: true,
        books: []
      }
    ];
  }

  // Gestion du panier
  addToSelectedBooks(book: Book) {
    const currentBooks = this.selectedBooksSubject.value;
    if (!currentBooks.find(b => b.id === book.id)) {
      this.selectedBooksSubject.next([...currentBooks, {...book, isSelected: true}]);
    }
  }

  removeFromSelectedBooks(bookId: number) {
    const currentBooks = this.selectedBooksSubject.value;
    this.selectedBooksSubject.next(currentBooks.filter(book => book.id !== bookId));
  }

  clearSelectedBooks() {
    this.selectedBooksSubject.next([]);
  }

  // Commandes
  submitOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }
}
