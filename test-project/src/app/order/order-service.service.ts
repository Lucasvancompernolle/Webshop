import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { basketItem } from '../basket-service/basket';
import { BasketService } from '../basket-service/basket.service';
import { Router } from '@angular/router';
import { Order, OrderLine } from './Order';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _orders = new BehaviorSubject<Order[]>([]);
  dataStore: { orders: Order[] } = { orders: [] };
  readonly orders = this._orders.asObservable();
  public ordersCount: number;

  private _orderLines = new BehaviorSubject<OrderLine[]>([]);
  dataStoreLines: { orderLines: OrderLine[] } = { orderLines: [] };
  readonly orderLines = this._orderLines.asObservable();

  constructor(private httpService: HttpClient, private basketService: BasketService, private router: Router) { }

  confirmOrder(customerId: string)
  {
    this.httpService.post("https://localhost:5001/api/Orders/" + customerId, 
    JSON.stringify(this.basketService.dataStore.basketItems),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {
        
        this.basketService.CloseBasketItems();
        
        this.router.navigate(["/home"]);
        
      }, error => alert("Confirming order failed!"));
  }

  getAllOrders()
  {
    this.httpService.get<Order[]>("https://localhost:5001/api/Orders",
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {
        
        this.ordersCount = data.length;
        this.dataStore.orders = data;
        this._orders.next(Object.assign({}, this.dataStore).orders);
        
      }, error => alert("getting orders failed!"));
  }

  getorderLines(ordId: number)
  {
    this.httpService.get<OrderLine[]>("https://localhost:5001/api/Orders/" + ordId,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {
        
        
        this.dataStoreLines.orderLines = data;
        this._orderLines.next(Object.assign({}, this.dataStoreLines).orderLines);
        
      }, error => alert("getting orders failed!"));
  }
  
}
