import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { Book, SimpleOrderRequest } from '../../models/book.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-all-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css', './filters-styles.css']
})
export class AllBooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  selectedBooks: Book[] = [];
  
  // المرشحات
  searchQuery = '';
  selectedCategory = 'الكل';
  selectedLanguage = 'الكل';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  
  // نموذج الطلب
  showOrderModal = false;
  customerFirstName = '';
  customerLastName = '';
  customerEmail = '';
  customerPhone = '';
  customerAddress = '';
  customerCity = '';
  orderNotes = '';
  
  // الحالات
  loading = false;
  error = '';
  orderSuccess = false;
  showFilters = false;
  
  private destroy$ = new Subject<void>();
  
  categories = [
    { value: 'الكل', label: 'جميع الفئات' },
    { value: 'Fiction', label: 'الروايات' },
    { value: 'Non-Fiction', label: 'غير روائي' },
    { value: 'Science-Fiction', label: 'خيال علمي' },
    { value: 'Science', label: 'العلوم' },
    { value: 'Histoire', label: 'التاريخ' },
    { value: 'Philosophie', label: 'الفلسفة' },
    { value: 'Art', label: 'الفنون' },
    { value: 'Cuisine', label: 'الطبخ' },
    { value: 'Technologie', label: 'التكنولوجيا' },
    { value: 'Santé', label: 'الصحة' },
    { value: 'Jeunesse', label: 'الأطفال والشباب' },
    { value: 'Romance', label: 'الرومانسية' },
    { value: 'Thriller', label: 'الإثارة' },
    { value: 'Fantasy', label: 'الخيال' }
  ];

  languages = [
    { value: 'الكل', label: 'جميع اللغات' },
    { value: 'francais', label: 'الفرنسية' },
    { value: 'anglais', label: 'الإنجليزية' },
    { value: 'العربية', label: 'العربية' }
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
    
    // Fallback to mock data if API fails
    this.bookService.getAvailableBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books) => {
          this.books = books.length > 0 ? books : this.getMockBooks();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.warn('API failed, using mock data:', err);
          this.books = this.getMockBooks();
          this.applyFilters();
          this.loading = false;
        }
      });
  }

  getMockBooks(): Book[] {
    return [
      {
        id: 1,
        title: 'الأسود يليق بك',
        author: 'أحلام مستغانمي',
        description: 'رواية عاطفية رائعة تحكي قصة حب استثنائية في زمن الحرب والسلام',
        price: 85,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Romance'
      },
      {
        id: 2,
        title: 'مئة عام من العزلة',
        author: 'غابرييل غارسيا ماركيز',
        description: 'تحفة أدبية عالمية تروي قصة عائلة بوينديا عبر مئة عام',
        price: 120,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'francais',
        category: 'Fiction'
      },
      {
        id: 3,
        title: 'الخيميائي',
        author: 'باولو كويلو',
        description: 'قصة ملهمة عن راعي أغنام يبحث عن كنز في الأهرامات المصرية',
        price: 95,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'francais',
        category: 'Philosophie'
      },
      {
        id: 4,
        title: 'هاري بوتر وحجر الفيلسوف',
        author: 'ج.ك. رولينغ',
        description: 'المغامرة السحرية الأولى للصبي الساحر هاري بوتر',
        price: 110,
        image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'anglais',
        category: 'Fantasy'
      },
      {
        id: 5,
        title: 'مدن الملح',
        author: 'عبد الرحمن منيف',
        description: 'رواية تاريخية تصور التحولات في الخليج العربي',
        price: 130,
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Histoire'
      },
      {
        id: 6,
        title: 'عقل لا يشيخ',
        author: 'د. دانيال أمين',
        description: 'دليل علمي للحفاظ على صحة الدماغ والذاكرة',
        price: 75,
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Santé'
      },
      {
        id: 7,
        title: 'أسرار الطبخ المغربي',
        author: 'لالة فاطمة الزهراء',
        description: 'مجموعة رائعة من الوصفات المغربية التقليدية والحديثة',
        price: 65,
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'francais',
        category: 'Cuisine'
      },
      {
        id: 8,
        title: 'الذكاء الاصطناعي',
        author: 'د. محمد العريان',
        description: 'مقدمة شاملة لعالم الذكاء الاصطناعي وتطبيقاته',
        price: 140,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Technologie'
      },
      {
        id: 9,
        title: 'فن الرسم بالألوان المائية',
        author: 'سارة أحمد',
        description: 'تعلم تقنيات الرسم بالألوان المائية خطوة بخطوة',
        price: 90,
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Art'
      },
      {
        id: 10,
        title: 'أطفال الغابة',
        author: 'نادية هاشم',
        description: 'قصة مغامرات مثيرة للأطفال في عالم الطبيعة',
        price: 55,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Jeunesse'
      },
      {
        id: 11,
        title: 'دليل المسافر الذكي',
        author: 'عمر السياح',
        description: 'نصائح وحيل للسفر الاقتصادي والممتع حول العالم',
        price: 80,
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'francais',
        category: 'Non-Fiction'
      },
      {
        id: 12,
        title: 'النجوم تتحدث',
        author: 'د. فاطمة الكوني',
        description: 'رحلة مشوقة في عالم الفلك والكواكب',
        price: 105,
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
        isAvailable: true,
        language: 'العربية',
        category: 'Science'
      }
    ];
  }

  applyFilters() {
    this.filteredBooks = this.books.filter(book => {
      // فلتر البحث النصي
      if (this.searchQuery.trim()) {
        const searchTerm = this.searchQuery.toLowerCase();
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            (book.description && book.description.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }
      
      // فلتر الفئة
      if (this.selectedCategory !== 'الكل' && book.category !== this.selectedCategory) {
        return false;
      }
      
      // فلتر اللغة
      if (this.selectedLanguage !== 'الكل' && book.language !== this.selectedLanguage) {
        return false;
      }
      
      // فلتر السعر
      if (this.minPrice !== null && book.price < this.minPrice) return false;
      if (this.maxPrice !== null && book.price > this.maxPrice) return false;
      
      return true;
    });
  }

  onSearch() {
    this.applyFilters();
  }
  
  onCategoryChange() {
    this.applyFilters();
  }

  onLanguageChange() {
    this.applyFilters();
  }
  
  onPriceFilter() {
    this.applyFilters();
  }
  
  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'الكل';
    this.selectedLanguage = 'الكل';
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
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

  canOrder(): boolean {
    return this.selectedBooks.length >= 10;
  }

  openOrderModal() {
    if (!this.canOrder()) {
      this.error = 'يجب اختيار 10 كتب على الأقل لإتمام الطلب';
      return;
    }
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.customerFirstName = '';
    this.customerLastName = '';
    this.customerEmail = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.customerCity = '';
    this.orderNotes = '';
    this.error = '';
    this.orderSuccess = false;
  }

  submitOrder() {
    // التحقق من صحة البيانات
    if (!this.customerFirstName || !this.customerLastName || 
        !this.customerEmail || !this.customerPhone || !this.customerAddress) {
      this.error = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }
    
    if (!this.canOrder()) {
      this.error = 'يجب اختيار 10 كتب على الأقل';
      return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customerEmail)) {
      this.error = 'يرجى إدخال بريد إلكتروني صحيح';
      return;
    }
    
    // إعداد الطلب
    const orderItems = this.selectedBooks.map(book => ({
      bookId: book.id!,
      quantity: 1
    }));
    
    const orderRequest: SimpleOrderRequest = {
      firstName: this.customerFirstName,
      lastName: this.customerLastName,
      email: this.customerEmail,
      phoneNumber: this.customerPhone,
      address: `${this.customerAddress}${this.customerCity ? ', ' + this.customerCity : ''}`,
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
          
          // إغلاق النافذة بعد 3 ثواني
          setTimeout(() => {
            this.closeOrderModal();
          }, 3000);
        },
        error: (err) => {
          console.error('خطأ في الطلب:', err);
          this.error = err.error?.message || 'خطأ في إرسال الطلب';
          this.loading = false;
        }
      });
  }
  
  getTotalPrice(): number {
    return this.selectedBooks.reduce((total, book) => total + book.price, 0);
  }

  getCategoryLabel(value?: string): string {
    if (!value) return 'غير محدد';
    const category = this.categories.find(c => c.value === value);
    return category ? category.label : value;
  }

  getLanguageLabel(value?: string): string {
    if (!value) return 'غير محدد';
    const language = this.languages.find(l => l.value === value);
    return language ? language.label : value;
  }

  getBookImageUrl(book: Book): string {
    if (!book.image) {
      return 'assets/images/default-book.svg';
    }
    
    // If it's already a full URL, return as-is
    if (book.image.startsWith('http')) {
      return book.image;
    }
    
    // If it's base64, return as-is
    if (book.image.startsWith('data:')) {
      return book.image;
    }
    
    // If it's a relative path, construct full URL
    return `http://localhost:8080/uploads/${book.image}`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/default-book.svg';
  }

  // Nouvelles méthodes pour les fonctionnalités améliorées
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  hasActiveFilters(): boolean {
    return this.searchQuery.trim() !== '' || 
           this.selectedCategory !== 'الكل' || 
           this.selectedLanguage !== 'الكل' || 
           this.minPrice !== null || 
           this.maxPrice !== null;
  }

  selectCategory(category: string) {
    this.selectedCategory = this.selectedCategory === category ? 'الكل' : category;
    this.applyFilters();
  }

  selectLanguage(language: string) {
    this.selectedLanguage = this.selectedLanguage === language ? 'الكل' : language;
    this.applyFilters();
  }

  getSpecialOffers(): Book[] {
    // Simuler des offres spéciales (livres avec prix < 100)
    return this.books.filter(book => book.price < 100).slice(0, 4);
  }

  getDiscountPercent(book: Book): number {
    const originalPrice = this.getOriginalPrice(book);
    return Math.round(((originalPrice - book.price) / originalPrice) * 100);
  }

  getOriginalPrice(book: Book): number {
    // Simuler un prix original (prix actuel + 20-40%)
    return Math.round(book.price * (1.2 + Math.random() * 0.2));
  }
}