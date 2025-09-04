import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BookService } from './services/book.service';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  selectedBooksCount = 0;
  currentYear = new Date().getFullYear();
  toastMessage = '';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.selectedBooks$.subscribe((books: Book[]) => {
      this.selectedBooksCount = books.length;
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
