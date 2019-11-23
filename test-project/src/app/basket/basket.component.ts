import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket-service/basket.service';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'remove'];
 

  constructor(private basketService: BasketService, private auth: AuthService, private router: Router) {
    
  }

  ngOnInit() {
    this.auth.user.subscribe(
      data => 
      {
        data ? this.basketService.getBasketData(data.uid) : null;
        
      }
    )

  }

  deleteSelectedItems() {

    this.basketService.deleteItem();
    setTimeout(() => this.ngOnInit(), 100);
  }

}
