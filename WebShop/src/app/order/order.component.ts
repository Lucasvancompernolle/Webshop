import { Component, OnInit } from '@angular/core';
import { OrderService } from './order-service.service';
import { Order, OrderLine } from './order';
import { Observable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderComponent implements OnInit {

  orders: Observable<Order[]>;
  
  orderLines: Observable<OrderLine[]>
  expandedElement: OrderLine | null;
  columnsToDisplay = ['orderId', 'invoiceId', 'custId', 'payed', 'pdf'];
  displayedColumns: string[] = ['lineNo', 'item', 'qtyOrdered'];
 

  constructor(private orderService: OrderService) {
    
  }

  ngOnInit() {
    this.orderService.getAllOrders();
    this.orders = this.orderService.orders;
  }

  getOrderLines(orderId: number)
  {
    this.orderService.getorderLines(orderId);
    this.orderLines = this.orderService.orderLines;
  }

  

}
