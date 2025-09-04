import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book.model';

@Pipe({
  name: 'totalPrice',
  standalone: true
})
export class TotalPricePipe implements PipeTransform {
  transform(books: Book[]): number {
    return books.reduce((total, book) => total + book.price, 0);
  }
}