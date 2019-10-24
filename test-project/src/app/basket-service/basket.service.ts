import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { basketItem } from '../basket/basket';
import { tap, catchError, map } from 'rxjs/operators';
import { ICar } from '../cars/car';

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
      tap(items => console.log("all " + JSON.stringify(items))),
      catchError(this.handleError));

    this.basketItems.subscribe(data => {

      this._proposals = <basketItem[]>data; // save your data
      this.updateLists.next(this._proposals); // emit your data
    })

  }

  next(){
    // scan((acc,value) => acc.concat(value))
    // .subscribe((data) => {
    //   console.log(data);
    // this.basketItems. = this.basketItems;
    // this.basketItems.subscribe(data => {

    //   this._proposals = <basketItem[]>data; // save your data
    //   this.updateLists.next(this._proposals); // emit your data
    // })
  }

  test(num: number) {

    for (const item of this._proposals) {
      if (item.id == num)
        item.delete = !item.delete;
    };

    this.updateLists.next(Object.assign({}, this._proposals));
  }

  deleteItem() {

    for (const iterator of this._proposals) {
      if (iterator.delete == true)
        this.httpService.delete<basketItem[]>("https://localhost:5001/api/BasketItem/" + iterator.id).subscribe();
    };

  }

  addCarToBasket(car: ICar, qty: number) {
    let item = new basketItem();
    item.prodId = car.id;
    item.custNumber = 16 // need to pass the real cust num
    item.productBrand = car.brand;
    item.price = car.price;
    item.qty = qty;
    item.delete = false;


    this.pushBasketData(item);

  }

  pushBasketData(item: basketItem) {

    console.log("new item: " + JSON.stringify(item))
    this.basketItems = this.httpService.post<basketItem[]>("https://localhost:5001/api/basketitem", "[" + JSON.stringify(item) + "]",
      this.httpOptions)
      .pipe(tap(item => console.log("all " + JSON.stringify(item))),
        catchError(this.handleError));

        this.basketItems.pipe(map(usersList => {
          usersList.push(item);
          return usersList;
        })).subscribe();
    // this.basketItems.subscribe();
    // this._proposals.push(item);
    // this.updateLists.next(this._proposals);


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
