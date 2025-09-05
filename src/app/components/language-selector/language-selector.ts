import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, Language } from '../../services/i18n.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css'
})
export class LanguageSelector implements OnInit, OnDestroy {
  currentLanguage: Language = 'ar';
  showDropdown = false;
  languages = [
    { code: 'ar' as Language, name: 'العربية', flag: '🇲🇦' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(private i18nService: I18nService) {}

  ngOnInit(): void {
    this.i18nService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  changeLanguage(language: Language): void {
    this.i18nService.setLanguage(language);
    this.showDropdown = false;
  }

  getCurrentLanguage() {
    return this.languages.find(l => l.code === this.currentLanguage) || this.languages[0];
  }
}
