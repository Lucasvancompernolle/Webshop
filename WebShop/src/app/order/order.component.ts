import { Component, OnInit } from '@angular/core';
import { OrderService } from './order-service.service';
import { Order, OrderLine } from './order';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
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
  //selection = new SelectionModel<Order>(true, []);

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

  // isAllSelected() {

  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.orderService.ordersCount;
    

  //   if (numSelected === 0 && numRows === 0)
  //     return false;

  //   return numSelected === numRows;

  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {

  //   if (this.isAllSelected()) {

  //     this.selection.clear()
  //     this.orderService.dataStore.orders.forEach(element => element.selected = true);

  //   }
  //   else {

  //     this.orderService.dataStore.orders.forEach(element => {
  //       this.selection.select(element);
  //       element.selected = false;
  //     });
  //   }
  // }

  // /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: Order): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   // row.delete != row.delete;

  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }

}
