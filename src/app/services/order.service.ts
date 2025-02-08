// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Order } from '../model/order';

// @Injectable({
//   providedIn: 'root',
// })
// export class OrderService {
//   private orders: Order[] = [];
//   private ordersSubject = new BehaviorSubject<Order[]>(this.orders);
//   orders$ = this.ordersSubject.asObservable();

//   getOrders(): Order[] {
//     return this.orders;
//   }

//   addOrder(order: Order) {
//     this.orders.push(order);
//     this.ordersSubject.next(this.orders);
//   }

//   updateOrder(updatedOrder: Order) {
//     const index = this.orders.findIndex((o) => o.id === updatedOrder.id);
//     if (index !== -1) {
//       this.orders[index] = updatedOrder;
//       this.ordersSubject.next(this.orders);
//     }
//   }

//   deleteOrder(id: number) {
//     this.orders = this.orders.filter((o) => o.id !== id);
//     this.ordersSubject.next(this.orders);
//   }

//   confirmPayment(orderId: number) {
//     const order = this.orders.find((o) => o.id === orderId);
//     if (order) {
//       order.status = 'Paid';
//       this.ordersSubject.next(this.orders);
//     }
//   }

//   confirmDelivery(orderId: number) {
//     const order = this.orders.find((o) => o.id === orderId);
//     if (order) {
//       order.status = 'Delivered';
//       this.ordersSubject.next(this.orders);
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);
  orders$ = this.ordersSubject.asObservable();

  getOrders(): Order[] {
    return this.orders;
  }

  getOrdersByPharmacy(pharmacyId: number): Order[] {
    return this.orders.filter((order) => order.pharmacyId === pharmacyId);
  }

  addOrder(order: Order) {
    this.orders.push(order);
    this.ordersSubject.next(this.orders);
  }

  updateOrder(updatedOrder: Order) {
    const index = this.orders.findIndex((o) => o.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
      this.ordersSubject.next(this.orders);
    }
  }

  deleteOrder(id: number) {
    this.orders = this.orders.filter((o) => o.id !== id);
    this.ordersSubject.next(this.orders);
  }

  confirmPayment(orderId: number) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'Paid';
      this.ordersSubject.next(this.orders);
    }
  }

  confirmDelivery(orderId: number) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'Delivered';
      this.ordersSubject.next(this.orders);
    }
  }
}
