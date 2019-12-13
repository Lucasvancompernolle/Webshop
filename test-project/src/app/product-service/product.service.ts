import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  private _products = new BehaviorSubject<Product[]>([]);
  dataStore: { basketItems: Product[] } = { basketItems: [] };
  readonly basketItems = this._products.asObservable();

  constructor(private httpService: HttpClient, public auth: AuthService) { }

  getProducts() {
    this.productsData = this.httpService.get<Product[]>("https://localhost:5001/api/products", {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(products => console.log("all " + JSON.stringify(products))),
      catchError(this.handleError));

    this.productsData.subscribe((data: Product[]) => {

      this._products = data; 
      console.log("all Loaded products  = " + JSON.stringify(this._products))
      this.updateLists.next(this._products); 
    });
  }

  getProductItemById(Id: number): Observable<Product> {
    return this.httpService.get<Product>("https://localhost:5001/api/products/" + Id, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(product => console.log("Single product: " + JSON.stringify(product))),
      catchError(this.handleError));
  }

  findProduct(productId: number): Product {

    for (const iterator of this._products) {
      if (iterator.id == productId)
        return iterator;
    }
  }

  AddProduct(product: Product) {
    return this.httpService.post<Product>("https://localhost:5001/api/products", product,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).pipe(
        tap(product => console.log("Added product: " + JSON.stringify(product))),
        catchError(this.handleError));
  }

  UpdateProduct(Id: number, product: Product) {
    return this.httpService.put<Product>("https://localhost:5001/api/products/" + Id, product).pipe(
      tap(product => console.log("Updated product: " + JSON.stringify(product))),
      catchError(this.handleError));
  }

  DeleteProduct(id: number) {
    return this.httpService.delete<Product>("https://localhost:5001/api/products/" + id).pipe(
      tap(product => console.log("Updated product: " + JSON.stringify(product))),
      catchError(this.handleError)).subscribe(
        () => {
          this._products = this._products.filter(item => item.id == id);
          this.productsData.next(this._products);
        }
      );
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
