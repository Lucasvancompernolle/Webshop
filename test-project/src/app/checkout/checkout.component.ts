import { Component, OnInit } from '@angular/core';
import { BasketComponent } from '../basket/basket.component';
import { BasketService } from '../basket-service/basket.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { basketItem } from '../basket/basket';
import { AuthService } from '../authentication/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CheckoutComponent implements OnInit {

  dataSource: basketItem[] ;
  dataSource2;
  columnsToDisplay = ['name', 'weight', 'price', 'position'];
  expandedElement: basketItem | null;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'price'];

  selection = new SelectionModel<basketItem>(true, []);

  constructor(private basket: BasketService, private auth: AuthService) {
    
   }

  ngOnInit() {
    this.auth.user.subscribe(
      data => 
      {
        data ? this.basket.getBasketData(data.uid) : null;
        this.basket.basketItems.subscribe(
          data => {this.dataSource = data;
          this.dataSource2 = new MatTableDataSource<basketItem>(data);
          }
        );
        
      }
    )
  }

  getTotalCost() {
    return this.dataSource.map(t => t.price * t.qty).reduce((acc, value) => acc + value, 0);
  }
  
  deleteSelectedItems() {

    this.basket.deleteItem();
    setTimeout(() => this.ngOnInit(), 100);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if(this.dataSource)
    {
      const numRows = this.dataSource2.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.dataSource.forEach(element => {
      element.delete = false;
    });
    this.ngOnInit();
    // this.isAllSelected() ?
    //     this.selection.clear() :
    //     this.dataSource2.data.forEach(row => { this.selection.select(row)});
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: basketItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    row.delete != row.delete;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
