import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { CustomerService } from './customer.service';
import { Observable } from 'rxjs';
import { Customer } from './Customer';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomerComponent implements OnInit {

  columnsToDisplay = ['custId', 'name'];
  expandedElement: Customer | null;
 customers: Observable<Customer[]>;

  constructor( private custService: CustomerService) { }

  ngOnInit() {
    this.custService.getCustomers();
    this.customers = this.custService.customers;
  }

}
