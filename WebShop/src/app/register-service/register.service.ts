import { Injectable } from '@angular/core';
import { Customer } from '../customer/Customer';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomerService } from '../customer/customer.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  public customer: Customer;

  constructor(private custService: CustomerService) { }

  createNewCustomer(customer: Customer) {

   this.custService.createCustomer(customer);
   

  }

 
}
