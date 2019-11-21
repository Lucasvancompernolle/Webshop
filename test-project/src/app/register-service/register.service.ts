import { Injectable } from '@angular/core';
import { Customer } from '../authentication/Customer';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  public customer: Customer;

  constructor(private httpService: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'https://localhost:5001',
      // 'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
      // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    })
  };

  createNewCustomer(customer: Customer) {


    this.httpService.post<Customer>("https://localhost:5001/api/customers", JSON.stringify(customer),
      this.httpOptions)
      .pipe(tap(customer => {
        console.log("New customer" + JSON.stringify(customer));
        this.customer = customer;
      }),
        catchError(this.handleError)).subscribe();

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
