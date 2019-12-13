import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket-service/basket.service';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { basketItem } from '../basket-service/basket';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'remove'];
  basketItems: Observable<basketItem[]>;

  constructor(private basketService: BasketService, private auth: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.auth.user.subscribe(
      data => data ?
        this.basketService.getBasketData(data.uid) : null);
    this.basketItems = this.basketService.basketItems;

  }

  deleteSelectedItems() {

    this.basketService.deleteItem();
   
  }

}
