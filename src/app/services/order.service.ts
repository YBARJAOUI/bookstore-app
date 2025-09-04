import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Order, 
  CreateOrderRequest, 
  CreateOrderDTO, 
  SimpleOrderRequest,
  OrderStatus,
  PaymentStatus 
} from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://192.168.50.198:8080/api';

  constructor(private http: HttpClient) {}

  // Création de commandes
  createOrder(orderRequest: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, orderRequest);
  }

  createCompleteOrder(orderDTO: CreateOrderDTO): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/complete-orders`, orderDTO);
  }

  createSimpleOrder(simpleOrderRequest: SimpleOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/complete-orders/simple`, simpleOrderRequest);
  }

  // Récupération des commandes
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/all`);
  }

  getOrdersWithPagination(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/orders`, { params });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  getOrderByNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/number/${orderNumber}`);
  }

  // Commandes par client
  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/customer/${customerId}`);
  }

  getOrdersByCustomerPaginated(customerId: number, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/orders/customer/${customerId}/paginated`, { params });
  }

  // Recherche et filtrage
  searchOrders(keyword: string): Observable<Order[]> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get<Order[]>(`${this.apiUrl}/orders/search`, { params });
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/status/${status}`);
  }

  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/pending`);
  }

  // Gestion des statuts
  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    let params = new HttpParams().set('status', status);
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}/status`, {}, { params });
  }

  updatePaymentStatus(id: number, paymentStatus: PaymentStatus): Observable<Order> {
    let params = new HttpParams().set('paymentStatus', paymentStatus);
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}/payment-status`, {}, { params });
  }

  cancelOrder(id: number, reason?: string): Observable<Order> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}/cancel`, {}, { params });
  }

  // Statistiques
  getOrderStatistics(startDate?: Date, endDate?: Date): Observable<any> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<any>(`${this.apiUrl}/orders/statistics`, { params });
  }

  // Méthodes utilitaires
  calculateOrderTotal(items: { bookId: number, quantity: number, price?: number }[]): number {
    return items.reduce((total, item) => {
      return total + (item.quantity * (item.price || 0));
    }, 0);
  }

  generateOrderSummary(order: Order): string {
    const itemCount = order.orderItems.length;
    const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    return `Commande ${order.orderNumber} - ${itemCount} type(s) de livre(s), ${totalItems} article(s) au total`;
  }

  getOrderStatusLabel(status: OrderStatus): string {
    const statusLabels: { [key in OrderStatus]: string } = {
      [OrderStatus.PENDING]: 'En attente',
      [OrderStatus.CONFIRMED]: 'Confirmée',
      [OrderStatus.PROCESSING]: 'En préparation',
      [OrderStatus.SHIPPED]: 'Expédiée',
      [OrderStatus.DELIVERED]: 'Livrée',
      [OrderStatus.CANCELLED]: 'Annulée'
    };
    return statusLabels[status] || status;
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    const statusLabels: { [key in PaymentStatus]: string } = {
      [PaymentStatus.PENDING]: 'En attente',
      [PaymentStatus.PAID]: 'Payé',
      [PaymentStatus.FAILED]: 'Échec',
      [PaymentStatus.REFUNDED]: 'Remboursé'
    };
    return statusLabels[status] || status;
  }
}