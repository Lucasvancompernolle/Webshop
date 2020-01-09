import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { basketItem } from '../basket-service/basket';
import { BasketService } from '../basket-service/basket.service';
import { Router } from '@angular/router';
import { Order, OrderLine } from './Order';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../product-service/product.service';

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

  confirmOrder(customerId: string) {
    this.httpService.post("https://localhost:5001/api/Orders/" + customerId,
      JSON.stringify(this.basketService.dataStore.basketItems),
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {

        this.basketService.CloseBasketItems();

      }, error => alert("Confirming order failed!"));


    this.router.navigate(["/home"]);
  }

  getAllOrders(status: number) // 1:open 99:closed 
  {
    this.httpService.get<Order[]>("https://localhost:5001/api/Orders/" + status,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {

        this.ordersCount = data.length;
        this.dataStore.orders = data;
        this._orders.next(Object.assign({}, this.dataStore).orders);

      }, error => alert("getting orders failed!"));
  }

  getOpenOrderLines(ordId: number) {
    this.httpService.get<OrderLine[]>("https://localhost:5001/api/Orders/openlines/" + ordId,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {


        this.dataStoreLines.orderLines = data.sort((n1,n2)=> n1.lineNo - n2.lineNo);
        this._orderLines.next(Object.assign({}, this.dataStoreLines).orderLines);

      }, error => alert("getting orders failed!"));
  }

  getclosedOrderLines(ordId: number) {
    this.httpService.get<OrderLine[]>("https://localhost:5001/api/Orders/closedlines/" + ordId,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {


        this.dataStoreLines.orderLines = data.sort((n1,n2)=> n1.lineNo - n2.lineNo);
        this._orderLines.next(Object.assign({}, this.dataStoreLines).orderLines);

      }, error => alert("getting orders failed!"));
  }

  getOrderLines(ordId: number) {
    this.httpService.get<OrderLine[]>("https://localhost:5001/api/Orders/" + ordId,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {


        this.dataStoreLines.orderLines = data.sort((n1,n2)=> n1.lineNo - n2.lineNo);
        this._orderLines.next(Object.assign({}, this.dataStoreLines).orderLines);

      }, error => alert("getting orders failed!"));
  }

  CloseLines(ordId: number) {
    this.httpService.get<OrderLine[]>("https://localhost:5001/api/Orders/close/" + ordId,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {

        this.dataStore.orders.find(o => o.orderId == ordId).status = 99;
        this.dataStore.orders = this.dataStore.orders.filter(o => o.status == 1);
        this._orders.next(Object.assign({}, this.dataStore).orders);

       

      }, error => alert("update orders failed!"));
  }

  ReopenLines(ordId: number) {
    this.httpService.get<OrderLine[]>("https://localhost:5001/api/Orders/open/" + ordId,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {

        
        this.dataStore.orders.find(o => o.orderId == ordId).status = 1;
        this.dataStore.orders = this.dataStore.orders.filter(o => o.status == 99);
        this._orders.next(Object.assign({}, this.dataStore).orders);

      

      }, error => alert("update orders failed!"));
  }


  CloseLine(ordId: number, lineNo: number) 
  {
    this.httpService.get<OrderLine>("https://localhost:5001/api/Orders/" + ordId + "/closeline/" + lineNo,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {


        this.dataStoreLines.orderLines.find(line => line.lineNo == lineNo).status = data.status;
        this._orderLines.next(Object.assign({}, this.dataStoreLines).orderLines);

      }, error => alert("update orders failed!"));
  }

  ReopenLine(ordId: number, lineNo: number) 
  {
    this.httpService.get<OrderLine>("https://localhost:5001/api/Orders/" + ordId + "/openline/" + lineNo,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).subscribe(data => {


        this.dataStoreLines.orderLines.find(line => line.lineNo == lineNo).status = data.status;
        this._orderLines.next(Object.assign({}, this.dataStoreLines).orderLines);

      }, error => alert("update orders failed!"));
  }

  GetPdfOrder(ordId: number) {
    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer'
    };

    this.httpService.get("https://localhost:5001/api/orders/InvoiceOrder/" + ordId, httpOption)
      .pipe(map((res: HttpResponse<any>) => {
        console.log(res.headers.get('content-disposition'));
        return {
          data: new Blob([res['body']],
            { type: 'application/pdf' }
          ),
        };
      }))
      .subscribe(res => {
        let date = new Date();
        const link = window.URL.createObjectURL(res.data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = link;
        a.download = 'Order_' + ordId + ".pdf";
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }, error => {
        throw error;
      }, () => {
        console.log('Completed file download.');
      });
  }

}
