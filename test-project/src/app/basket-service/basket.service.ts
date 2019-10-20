import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { basketItem } from '../basket/basket';
import { tap, catchError } from 'rxjs/operators';
import { ICar } from '../cars/car';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  basketItems: Observable<basketItem[]>;
  
  constructor(private httpService: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'https://localhost:5001',
      // 'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
      // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    })
  };

  getBasketData(): Observable<basketItem[]> {
    return this.httpService.get<basketItem[]>("https://localhost:5001/api/BasketItem/16", {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(cars => console.log("all " + JSON.stringify(cars))),
      catchError(this.handleError));

  }

  deleteItem(id: number) : Observable<basketItem[]> { 
    return this.httpService.delete<basketItem[]>("https://localhost:5001/api/BasketItem/" + id);
  }

  addCarToBasket(car: ICar, qty: number)
  {
    let item = new basketItem();
    item.prodId = car.id;
    item.custNumber = 16 // need to pass the real cust num
    item.productBrand = car.brand;
    item.price = car.price;
    item.qty = qty;
    item.delete = false;
    
    
    this.pushBasketData(item).subscribe();
    
  }

  pushBasketData(item: basketItem): Observable<basketItem> {


    console.log("new item: " + JSON.stringify(item))
    return this.httpService.post<basketItem>("https://localhost:5001/api/basketitem", "[" + JSON.stringify(item) + "]",
      this.httpOptions)
      .pipe(tap(item => console.log("all " + JSON.stringify(item))),
        catchError(this.handleError));

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
