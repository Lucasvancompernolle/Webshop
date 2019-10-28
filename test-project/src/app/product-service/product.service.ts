import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  updateLists: Subject<Product[]> = new Subject();
  productsData = <Observable<Product[]>>this.updateLists;
  _products: Product[] = [];
 

  constructor(private httpService: HttpClient) { }

  getProducts() {
    this.productsData = this.httpService.get<Product[]>("https://localhost:5001/api/products", {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(products => console.log("all " + JSON.stringify(products))),
      catchError(this.handleError));

      this.productsData.subscribe((data: Product[]) => {
      
        this._products = data ; // save your data
        console.log("all Loaded products  = " + JSON.stringify(this._products))
        this.updateLists.next(this._products); // emit your data
      });
  }

  findProduct(productId: number): Product {

   for (const iterator of this._products) {
     if(iterator.id == productId)
     return iterator;
     
   }

  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code ${err.status}, error message is ${err.message}.`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);

  }

}
