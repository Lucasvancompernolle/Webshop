import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { basketItem } from './basket';
import { tap, catchError, map, subscribeOn } from 'rxjs/operators';
import { Product } from '../product-service/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {


  private baseUrl = 'https://localhost:5001/api/';
  private _basketItems = new BehaviorSubject<basketItem[]>([]);
  dataStore: { basketItems: basketItem[] } = { basketItems: [] };
  readonly basketItems = this._basketItems.asObservable();
  BasketCount: number;

  constructor(private httpService: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'https://localhost:5001',
      // 'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
      // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    })
  };


  getBasketData(customerId: string) {
    this.httpService.get<basketItem[]>("https://localhost:5001/api/BasketItem/" + customerId,
      { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }).subscribe(data => {
        console.log(data);
        this.BasketCount = data.length;
        data.forEach((item) => item.delete = false);
        this.dataStore.basketItems = data;
        this._basketItems.next(Object.assign({}, this.dataStore).basketItems);
      }, error => console.log('Could not load todos.'));
  }


  CandidateForDeletion(num: number) {

    for (const item of this.dataStore.basketItems) {
      if (item.id == num)
        item.delete = !item.delete;
      console.log("CHANGED VALUE");
    };

    this._basketItems.next(Object.assign({}, this.dataStore).basketItems);
  }

  deleteItem() {

    this.dataStore.basketItems.forEach((item) => {
      if (item.delete == true) {
        this.httpService.delete<basketItem[]>("https://localhost:5001/api/BasketItem/" + item.id).subscribe(
          response => {
            console.log('Deleted basket item' + item.id);
          }), error => console.log('Could not delete basket items.')
        this.BasketCount -= 1;
      }
    });

    this.dataStore.basketItems = this.dataStore.basketItems.filter(item => item.delete === false);
    this._basketItems.next(this.dataStore.basketItems);

  }

  addProductToBasket(product: Product, qty: number, custId: string) {

    let item = new basketItem();
    item.prodId = product.id;
    item.custNumber = custId
    item.productBrand = product.brand;
    item.price = product.price;
    item.qty = qty;
    item.delete = false;


    this.pushBasketData(item);

  }

  pushBasketData(item: basketItem) {

    this.httpService.post<basketItem[]>("https://localhost:5001/api/basketitem", "[" + JSON.stringify(item) + "]",
      this.httpOptions)
      .pipe(tap(item => console.log("New item" + JSON.stringify(item))),
        catchError(this.handleError)).subscribe(
          data => {
            console.log("New item" + JSON.stringify(data));
          }
        );

  }

  private log(message: string) {
    console.log(`product:  : ${message}`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
