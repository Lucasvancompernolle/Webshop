import { Injectable } from '@angular/core';
import { Customer } from './Customer';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customer: Observable<Customer>;
  private _customers = new BehaviorSubject<Customer[]>([]);
  dataStore: { customers: Customer[] } = { customers: [] };
  readonly customers = this._customers.asObservable();
  httpOptions = {
    headers: new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'https://localhost:5001',
      // 'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
      // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    })}

  constructor(private httpService: HttpClient) { }

  getCustomers()
  {
    this.httpService.get<Customer[]>("https://localhost:5001/api/customers").subscribe(
      data =>{
        this.dataStore.customers = data;
        this._customers.next(Object.assign({}, this.dataStore).customers);
        console.log("customers: " + JSON.stringify(this.dataStore.customers))
      }
    )
  }

  checkIfUserIsCustomer(uid: string) : Observable<Customer> {
   return this.httpService.get<Customer>("https://localhost:5001/api/Customers/" + uid, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
    
  }

  createCustomer(customer: Customer)
  {
    this.httpService.post<Customer>("https://localhost:5001/api/customers", JSON.stringify(customer),
    this.httpOptions).subscribe(data => console.log("New customer " + JSON.stringify(customer)));

  }

  filterCustName(filterBy: string){
    
    this._customers.next(Object.assign({}, this.dataStore).customers.filter(value => value.firstName.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase())||
                                                                                     value.lastName.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase())));
  }



}
