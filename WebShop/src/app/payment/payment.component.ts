import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { OrderService } from '../order/order-service.service';
import { BasketService } from '../basket-service/basket.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  custNo: string;
  constructor(private authService: AuthService, 
    private orderService: OrderService) { 

    this.authService.user.subscribe(
      data => this.custNo = data.uid)
  }

  ngOnInit() {
  }

  ConfirmOrder()
  {
    this.orderService.confirmOrder(this.custNo);
    
  }

}
