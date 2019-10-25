import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { basketItem } from '../basket/basket';
import { tap, catchError, map, subscribeOn } from 'rxjs/operators';
import { Product } from '../product-service/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  updateLists: Subject<basketItem[]> = new Subject();
  basketItems = <Observable<basketItem[]>>this.updateLists;
  _proposals: basketItem[] = [];

  constructor(private httpService: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'https://localhost:5001',
      // 'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
      // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    })
  };

  getBasketData() {
    this.basketItems = this.httpService.get<basketItem[]>("https://localhost:5001/api/BasketItem/16", {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(),
      catchError(this.handleError));

    this.basketItems.subscribe(data => {
      
      this._proposals = data; // save your data
      console.log("all Loaded items  = " + JSON.stringify(this._proposals))
      this.updateLists.next(this._proposals); // emit your data
    })

  }

  CandidateForDeletion(num: number) {

    for (const item of this._proposals) {
      if (item.id == num)
        item.delete = !item.delete;
        console.log("CHANGED VALUE");
    };

    this.updateLists.next(Object.assign({}, this._proposals));
  }

  deleteItem() {

    for (const iterator of this._proposals) {
      console.log(iterator.delete)
      if (iterator.delete == true) {
        console.log("DELETED ITEM");
        this.httpService.delete<basketItem[]>("https://localhost:5001/api/BasketItem/" + iterator.id).subscribe();
      }
    };
    
  }

  addCarToBasket(product: Product, qty: number) {

    let item = new basketItem();
    item.prodId = product.id;
    item.custNumber = 16 // need to pass the real cust num
    item.productBrand = product.brand;
    item.price = product.price;
    item.qty = qty;
    item.delete = false;


    this.pushBasketData(item);

  }

  pushBasketData(item: basketItem) {
    
    
    this.basketItems = this.httpService.post<basketItem[]>("https://localhost:5001/api/basketitem", "[" + JSON.stringify(item) + "]",
      this.httpOptions)
      .pipe(tap(item => console.log("New item" + JSON.stringify(item))),
        catchError(this.handleError));

        this.basketItems.subscribe(data => {
          console.log("basketItems.subscribe data = " + JSON.stringify(data));
        
          this.updateLists.next(this._proposals);
          console.log("All items = " + JSON.stringify(this._proposals));

    });

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
