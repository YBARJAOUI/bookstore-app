import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, Language } from '../../services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css'
})
export class LanguageSelectorComponent {
  showDropdown = false;
  currentLanguage: Language = 'fr';

  languages = [
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' }
  ];

  constructor(private i18nService: I18nService) {
    this.i18nService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  changeLanguage(language: Language) {
    this.i18nService.setLanguage(language);
    this.showDropdown = false;
  }

  getCurrentLanguage() {
    return this.languages.find(lang => lang.code === this.currentLanguage) || this.languages[0];
  }
}