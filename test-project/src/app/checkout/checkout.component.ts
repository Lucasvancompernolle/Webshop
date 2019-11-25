import { Component, OnInit } from '@angular/core';
import { BasketComponent } from '../basket/basket.component';
import { BasketService } from '../basket-service/basket.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { basketItem } from '../basket/basket';
import { AuthService } from '../authentication/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CheckoutComponent implements OnInit {


  columnsToDisplay = ['name', 'weight', 'price', 'position'];
  expandedElement: basketItem | null;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'price'];

  selection = new SelectionModel<basketItem>(true, []);
  basketItems: Observable<basketItem[]>;

  constructor(private basket: BasketService, private auth: AuthService) {

  }

  ngOnInit() {
    this.auth.user.subscribe(
      data => data ?
        this.basket.getBasketData(data.uid) : null);
    this.basketItems = this.basket.basketItems;
  }

  getTotalCost() {
    //if (this.basket._proposals)
      return this.basket.dataStore.basketItems.map(t => t.price * t.qty).reduce((acc, value) => acc + value, 0);

  }

  deleteSelectedItems() {

    this.basket.deleteItem();
    this.selection.clear();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.basket.BasketCount;

    if (numSelected === 0 && numRows === 0)
      return false;

    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

   

    if (this.isAllSelected()) {

      this.selection.clear()
      this.basket.dataStore.basketItems.forEach(element => element.delete = true);
      this.basket.dataStore.basketItems.forEach(element => this.basket.CandidateForDeletion(element.id));

    }
    else {

      this.basket.dataStore.basketItems.forEach(element => {
        this.selection.select(element);
        element.delete = false;
        this.basket.CandidateForDeletion(element.id);
      });
    }

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: basketItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    // row.delete != row.delete;

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
