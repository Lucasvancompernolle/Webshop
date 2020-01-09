import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from './order-service.service';
import { Order, OrderLine } from './order';
import { Observable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderComponent implements OnInit {

  @Input('init')
  openOrders: boolean;

  orders: Observable<Order[]>;

  orderLines: Observable<OrderLine[]>
  expandedElement: OrderLine | null;
  columnsToDisplay = ['orderId', 'invoiceId', 'custId', 'payed', 'pdf', 'closeOrder'];
  displayedColumns: string[] = ['lineNo', 'item', 'qtyOrdered', 'closeLine'];


  constructor(private orderService: OrderService, private route: ActivatedRoute, private router :Router) {

  }

  ngOnInit() {

    this.openOrders = this.route.snapshot.paramMap.get('status') == "true";

    if (this.openOrders == true || this.openOrders == undefined )
      this.orderService.getAllOrders(1);

    else
      this.orderService.getAllOrders(99);
    this.orders = this.orderService.orders;
  }

  getOrderLines(ordId: number) {
    if (this.openOrders == true )
      this.orderService.getOpenOrderLines(ordId);

    else
      this.orderService.getclosedOrderLines(ordId);

    this.orderLines = this.orderService.orderLines;
  }



  CloseLines(orderId: number) {
    this.orderService.CloseLines(orderId);
    this.orderLines = this.orderService.orderLines;
    this.orders = this.orderService.orders;
  }

  ReOpenLines(orderId: number)
  {
    this.orderService.ReopenLines(orderId);
    this.orderLines = this.orderService.orderLines;
    this.orders = this.orderService.orders;
  }

  



}
