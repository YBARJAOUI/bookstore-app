export interface Book {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  imagePath?: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pack {
  id: number;
  name: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  active?: boolean;
  books: Book[];
  isHighlight?: boolean;
  badge?: 'NEW' | 'HOT' | 'SALE' | 'POPULAR';
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  image: string;
  validUntil: Date;
  active?: boolean;
  books: Book[];
}

export interface Order {
  customerName: string;
  customerPhone: string;
  books: Book[];
  totalPrice: number;
  orderDate: Date;
}
