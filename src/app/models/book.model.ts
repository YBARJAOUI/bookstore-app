export interface Book {
  id?: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  language?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pack {
  id?: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyOffer {
  id?: number;
  title: string;
  description?: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage?: number;
  image?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  book?: Book;
  pack?: Pack;
  limitQuantity?: number;
  soldQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number;
  bookId: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  book?: Book;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  customer?: Customer;
  orderItems: OrderItem[];
  totalAmount: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  shippingAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CreateOrderRequest {
  customerId?: number;
  items: {
    bookId: number;
    quantity: number;
  }[];
  shippingAddress?: string;
  notes?: string;
}

export interface CreateOrderDTO {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  items: {
    bookId: number;
    quantity: number;
  }[];
  shippingAddress?: string;
  notes?: string;
}

export interface SimpleOrderRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  items: {
    bookId: number;
    quantity: number;
  }[];
  notes?: string;
}

export interface BookFilterRequest {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  page?: number;
  size?: number;
}
