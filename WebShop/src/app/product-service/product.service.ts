import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../authentication/auth.service';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private _products = new BehaviorSubject<Product[]>([]);
  dataStore: { products: Product[] } = { products: [] };
  readonly products = this._products.asObservable();

  constructor(private httpService: HttpClient, public auth: AuthService) { }

  getProducts() {
    this.httpService.get<Product[]>("https://localhost:5001/api/products").pipe(
      tap(products => console.log("all " + JSON.stringify(products))),
      catchError(this.handleError)).subscribe((data: Product[]) => {

        this.dataStore.products = data;
        this._products.next(Object.assign({}, this.dataStore).products);
        console.log("all Loaded products  = " + JSON.stringify(this.dataStore.products))
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

    for (const product of this.dataStore.products) {
      if (product.id == productId)
        return product;
    }
  }

  filterProducts(filterBy: string){
    
    this._products.next(Object.assign({}, this.dataStore).products.filter(value => value.name.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase())));
  }
  filterProductsPrice(filterBy: string){
    
    this._products.next(Object.assign({}, this.dataStore).products.filter(value => value.price >= parseFloat(filterBy)));
  }

  AddProduct(product: Product) {
    return this.httpService.post<Product>("https://localhost:5001/api/products", product,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).pipe(
        
        tap(product => {
          this.dataStore.products.push(product);
          this._products.next(Object.assign({}, this.dataStore).products);
          console.log("Added product: " + JSON.stringify(product))
        }),
        catchError(this.handleError));
  }

  UpdateProduct(Id: number, product: Product) {
    return this.httpService.put<Product>("https://localhost:5001/api/products/" + Id, product).pipe(
      tap(product => console.log("Updated product: " + JSON.stringify(product))),
      catchError(this.handleError));
  }

  DeleteProduct(id: number) {
    this.httpService.delete<Product>("https://localhost:5001/api/products/" + id).pipe(
      tap(product => console.log("Updated product: " + JSON.stringify(product))),
      catchError(this.handleError)).subscribe(
        () => {
          this.dataStore.products = this.dataStore.products.filter(item => item.id != id);
          this._products.next(this.dataStore.products);

        }
      );
  }

  UploadExcel(productsFromExcel: Product[]) {
    

    return this.httpService.post<Product>("https://localhost:5001/api/products/list", productsFromExcel,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }).pipe(
        tap(product => console.log("Added products from exel: " + JSON.stringify(product))),
        catchError(this.handleError));
  }

  DownloadExcel() {

    const httpOption: Object = {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'arraybuffer'
    };

    this.httpService.get("https://localhost:5001/api/products/DownloadExcel", httpOption)
      .pipe(map((res: HttpResponse<any>) => {
        console.log(res.headers.get('content-disposition'));
        return {
          data: new Blob([res['body']],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
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
        a.download = 'Products_' + date.toDateString() + "_" + date.toTimeString() + ".xlsx";
        a.click();
        window.URL.revokeObjectURL(link);
        a.remove();
      }, error => {
        throw error;
      }, () => {
        console.log('Completed file download.');
      });

  }


  BindUser(): Observable<Product[]> {
    return this.httpService.get<Product[]>("https://localhost:5001/api/products/UploadExcel");
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
