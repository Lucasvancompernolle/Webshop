import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { BasketService } from '../basket-service/basket.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private auth: AuthService ,
    private basketService: BasketService) { 
    
  }

  ngOnInit() {
  }

  

}
