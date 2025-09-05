import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { DailyOffer, Pack, SimpleOrderRequest } from '../../models/book.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit, OnDestroy {
  dailyOffers: DailyOffer[] = [];
  packs: Pack[] = [];
  loading = false;
  error = '';

  // نافذة الطلب
  showOrderModal = false;
  showOfferModal = false;
  selectedOffer: DailyOffer | null = null;
  selectedPack: Pack | null = null;

  // بيانات العميل
  customerFirstName = '';
  customerLastName = '';
  customerEmail = '';
  customerPhone = '';
  customerAddress = '';
  customerCity = '';
  orderNotes = '';

  // حالات
  orderSuccess = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private orderService: OrderService
  ) {}

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

    // تحميل العروض اليومية
    this.bookService.getCurrentDailyOffers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (offers) => {
          this.dailyOffers = offers.filter(offer => this.isOfferValid(offer));
        },
        error: (err) => {
          console.error('خطأ في تحميل العروض:', err);
          this.error = 'خطأ في تحميل العروض';
        }
      });

    // تحميل الحزم المميزة
    this.bookService.getFeaturedPacks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (packs) => {
          this.packs = packs.filter(pack => pack.isActive);
          this.loading = false;
        },
        error: (err) => {
          console.error('خطأ في تحميل الحزم:', err);
          // محاولة الحصول على الحزم النشطة
          this.bookService.getActivePacks()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (packs) => {
                this.packs = packs;
                this.loading = false;
              },
              error: (fallbackErr) => {
                this.error = 'خطأ في تحميل الحزم';
                this.loading = false;
              }
            });
        }
      });
  }

  isOfferValid(offer: DailyOffer): boolean {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    return (offer.isActive ?? false) && now >= startDate && now <= endDate;
  }

  calculateSavings(originalPrice: number, offerPrice: number): number {
    return originalPrice - offerPrice;
  }

  getDaysRemaining(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  selectOffer(offer: DailyOffer) {
    this.selectedOffer = offer;
    this.selectedPack = null;
    this.showOfferModal = true;
  }

  selectPack(pack: Pack) {
    this.selectedPack = pack;
    this.selectedOffer = null;
    this.showOfferModal = true;
  }

  orderOffer(offer: DailyOffer) {
    this.selectedOffer = offer;
    this.selectedPack = null;
    this.showOrderModal = true;
  }

  orderPack(pack: Pack) {
    this.selectedPack = pack;
    this.selectedOffer = null;
    this.showOrderModal = true;
  }

  closeOfferModal() {
    this.showOfferModal = false;
    this.selectedOffer = null;
    this.selectedPack = null;
    this.resetForm();
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.selectedOffer = null;
    this.selectedPack = null;
    this.resetForm();
  }

  resetForm() {
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

  submitOfferOrder() {
    // التحقق من صحة البيانات
    if (!this.customerFirstName || !this.customerLastName || 
        !this.customerEmail || !this.customerPhone || !this.customerAddress) {
      this.error = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customerEmail)) {
      this.error = 'يرجى إدخال بريد إلكتروني صحيح';
      return;
    }

    const orderNotes = this.getOrderDescription();

    // إعداد طلب وهمي (لأننا نحتاج bookId)
    const orderRequest: SimpleOrderRequest = {
      firstName: this.customerFirstName,
      lastName: this.customerLastName,
      email: this.customerEmail,
      phoneNumber: this.customerPhone,
      address: `${this.customerAddress}${this.customerCity ? ', ' + this.customerCity : ''}`,
      items: [{ bookId: 1, quantity: 1 }], // قيمة وهمية
      notes: orderNotes
    };

    this.loading = true;
    this.error = '';

    this.orderService.createSimpleOrder(orderRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.orderSuccess = true;
          this.loading = false;
          
          // إغلاق النافذة بعد 3 ثواني
          setTimeout(() => {
            this.closeOfferModal();
          }, 3000);
        },
        error: (err) => {
          console.error('خطأ في الطلب:', err);
          this.error = err.error?.message || 'خطأ في إرسال الطلب';
          this.loading = false;
        }
      });
  }

  submitOrder() {
    return this.submitOfferOrder();
  }

  getOrderDescription(): string {
    let description = '';
    
    if (this.selectedOffer) {
      description = `عرض خاص: ${this.selectedOffer.title} - السعر: ${this.selectedOffer.offerPrice} درهم`;
      if (this.selectedOffer.book) {
        description += ` - الكتاب: ${this.selectedOffer.book.title}`;
      }
      if (this.selectedOffer.pack) {
        description += ` - الحزمة: ${this.selectedOffer.pack.name}`;
      }
    } else if (this.selectedPack) {
      description = `حزمة: ${this.selectedPack.name} - السعر: ${this.selectedPack.price} درهم`;
    }

    if (this.orderNotes) {
      description += ` - ملاحظات: ${this.orderNotes}`;
    }

    return description;
  }

  getCurrentPrice(): number {
    if (this.selectedOffer) {
      return this.selectedOffer.offerPrice;
    } else if (this.selectedPack) {
      return this.selectedPack.price;
    }
    return 0;
  }

  getOriginalPrice(): number {
    if (this.selectedOffer) {
      return this.selectedOffer.originalPrice;
    }
    return this.getCurrentPrice();
  }

  getItemTitle(): string {
    if (this.selectedOffer) {
      return this.selectedOffer.title;
    } else if (this.selectedPack) {
      return this.selectedPack.name;
    }
    return '';
  }

  getSavingsAmount(): number {
    return this.getOriginalPrice() - this.getCurrentPrice();
  }

  getSavingsPercentage(): number {
    const original = this.getOriginalPrice();
    const current = this.getCurrentPrice();
    if (original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  }
}