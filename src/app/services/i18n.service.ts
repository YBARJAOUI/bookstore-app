import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'ar' | 'en' | 'fr';

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<Language>('ar');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Record<Language, Translations> = {
    ar: {
      // Navigation
      home: 'الرئيسية',
      books: 'الكتب',
      offers: 'العروض',
      packs: 'الحزم',
      contact: 'اتصل بنا',
      
      // Books page
      allBooks: 'جميع الكتب',
      booksSubtitle: 'اكتشف مجموعتنا من الكتب واطلب بسهولة',
      searchPlaceholder: 'البحث بالعنوان أو المؤلف أو الوصف...',
      all: 'الكل',
      fiction: 'الخيال',
      development: 'التطوير',
      business: 'الأعمال',
      youth: 'الشباب',
      science: 'العلوم',
      history: 'التاريخ',
      price: 'السعر (درهم)',
      minPrice: 'الحد الأدنى',
      maxPrice: 'الحد الأقصى',
      author: 'المؤلف',
      allAuthors: 'جميع المؤلفين',
      clearFilters: 'مسح المرشحات',
      available: 'متوفر',
      unavailable: 'غير متوفر',
      
      // Pagination
      page: 'الصفحة',
      of: 'من',
      totalBooks: 'كتاب إجمالي',
      previous: 'السابق',
      next: 'التالي',
      
      // Selection and cart
      booksSelected: 'كتاب مختار',
      orderBooks: 'طلب الكتب',
      
      // Order modal
      finalizeOrder: 'إنهاء طلبك',
      summary: 'ملخص',
      total: 'المجموع',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      address: 'عنوان التسليم',
      additionalNotes: 'ملاحظات إضافية (اختياري)',
      deliveryInstructions: 'تعليمات التسليم الخاصة...',
      cancel: 'إلغاء',
      confirmOrder: 'تأكيد الطلب',
      sending: 'جارٍ الإرسال...',
      orderSuccess: 'تم إرسال الطلب بنجاح!',
      emailConfirmation: 'ستتلقى تأكيداً عبر البريد الإلكتروني.',
      
      // Offers page
      currentOffers: 'العروض الحالية',
      offersSubtitle: 'استفد من الخصومات المحدودة والعروض الحصرية',
      dailyOffers: '🔥 العروض اليومية',
      dailyOffersSubtitle: 'عروض محدودة الوقت',
      exclusivePacks: '📦 حزمنا الحصرية',
      exclusivePacksSubtitle: 'مجموعات مختارة خصيصاً لك',
      save: 'وفر',
      takeAdvantage: 'استفد',
      expiredOffer: 'انتهت الصلاحية',
      remainingDays: 'يوم متبقي فقط!',
      available_quantity: 'متوفر',
      outOfStock: 'نفد المخزون',
      featured: '⭐ مميز',
      viewPack: 'عرض الحزمة',
      
      // No content messages
      noBooksFound: 'لم يتم العثور على كتب',
      changeSearchCriteria: 'حاول تعديل معايير البحث',
      noOffersAvailable: 'لا توجد عروض متاحة في الوقت الحالي',
      checkBackSoon: 'عد قريباً لاكتشاف عروضنا الجديدة!',
      seeAllBooks: 'عرض جميع الكتب',
      noPacksAvailable: 'لا توجد حزم متاحة',
      packsInPreparation: 'حزمنا قيد التحضير. عد قريباً!',
      
      // Pack page
      thematicPacks: 'الحزم الموضوعية',
      packsSubtitle: 'وفر مع حزمنا الذكية وابدأ مكتبتك المثالية',
      whyChoosePacks: 'لماذا تختار حزمنا؟',
      guaranteedSavings: '✅ توفير مضمون',
      expertSelection: '✅ اختيار خبير حسب الموضوع',
      groupedDelivery: '✅ تسليم مجمع',
      carefullyAssembled: '✅ مجموعات مجمعة بعناية',
      
      // Offer conditions
      offerConditions: 'شروط العروض',
      validSubjectToStock: '🎯 العروض سارية ضمن حدود المخزون المتاح',
      fastDelivery: '📦 تسليم سريع في جميع أنحاء المغرب',
      nonCumulative: '🎁 العروض غير قابلة للتراكم مع عروض أخرى',
      securePayment: '💳 دفع آمن عند التسليم',
      customerService: '📞 خدمة العملاء متاحة لمساعدتك',
      
      // Loading and errors
      loading: 'جارٍ التحميل...',
      loadingBooks: 'جارٍ تحميل الكتب...',
      loadingOffers: 'جارٍ تحميل العروض...',
      loadingPacks: 'جارٍ تحميل الحزم...',
      error: 'خطأ',
      booksLoadError: 'خطأ أثناء تحميل الكتب',
      offersLoadError: 'خطأ أثناء تحميل العروض',
      packsLoadError: 'خطأ أثناء تحميل الحزم',
      orderError: 'خطأ أثناء إرسال الطلب',
      
      // Validation messages
      fillAllFields: 'يرجى ملء جميع الحقول الإجبارية',
      selectAtLeastOneBook: 'يرجى اختيار كتاب واحد على الأقل',
      validEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      
      // Currency and units
      mad: 'درهم',
      days: 'أيام',
      inStock: 'في المخزون',
      lowStock: 'مخزون منخفض',
      
      // Time
      only: 'فقط',
      remaining: 'متبقي'
    },
    fr: {
      // Navigation
      home: 'Accueil',
      books: 'Livres',
      offers: 'Offres',
      packs: 'Packs',
      contact: 'Contact',
      
      // Books page
      allBooks: 'Tous les livres',
      booksSubtitle: 'Découvrez notre sélection de livres et commandez facilement',
      searchPlaceholder: 'Rechercher par titre, auteur ou description...',
      // ... autres traductions françaises
    },
    en: {
      // Navigation
      home: 'Home',
      books: 'Books',
      offers: 'Offers',
      packs: 'Packs',
      contact: 'Contact',
      
      // Books page
      allBooks: 'All Books',
      booksSubtitle: 'Discover our book selection and order easily',
      searchPlaceholder: 'Search by title, author or description...',
      // ... autres traductions anglaises
    }
  };

  constructor() {
    // Détecter la langue du navigateur ou utiliser l'arabe par défaut
    const browserLang = this.getBrowserLanguage();
    const savedLang = this.isBrowser() ? localStorage.getItem('bookstore-language') as Language : null;
    const initialLang = savedLang || browserLang || 'ar';
    this.setLanguage(initialLang);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  get currentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguageSubject.next(lang);
    
    if (this.isBrowser()) {
      localStorage.setItem('bookstore-language', lang);
      
      // Définir la direction du texte
      const direction = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = direction;
      document.documentElement.lang = lang;
    }
  }

  translate(key: string, params?: Record<string, string>): string {
    const translation = this.getNestedTranslation(this.translations[this.currentLanguage], key);
    
    if (!translation) {
      console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
      return key;
    }

    let result = translation.toString();
    
    // Remplacer les paramètres si fournis
    if (params) {
      Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }

    return result;
  }

  private getNestedTranslation(obj: any, key: string): any {
    const keys = key.split('.');
    let current = obj;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }
    
    return current;
  }

  private getBrowserLanguage(): Language | null {
    if (!this.isBrowser()) return null;
    
    const lang = navigator.language.substr(0, 2).toLowerCase();
    if (lang === 'ar' || lang === 'en' || lang === 'fr') {
      return lang as Language;
    }
    return null;
  }

  // Méthodes utilitaires pour l'arabe
  isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }

  formatNumber(num: number): string {
    // Utiliser les chiffres arabes pour l'arabe
    if (this.currentLanguage === 'ar') {
      return num.toLocaleString('ar-EG');
    }
    return num.toLocaleString();
  }

  formatCurrency(amount: number): string {
    const formattedAmount = this.formatNumber(amount);
    return `${formattedAmount} ${this.translate('mad')}`;
  }
}