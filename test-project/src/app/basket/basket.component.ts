import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket-service/basket.service';
import { AuthService } from '../authentication/auth.service';
import { RegisterService } from '../register-service/register.service';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  

  constructor(private basketService: BasketService, private auth: AuthService) {
    
  }

  ngOnInit() {
    this.auth.user.subscribe(
      data => data ? this.basketService.getBasketData(data.uid) : null
    )

  }

  deleteSelectedItems() {

    this.basketService.deleteItem();
    setTimeout(() => this.ngOnInit(), 100);
  }

}
