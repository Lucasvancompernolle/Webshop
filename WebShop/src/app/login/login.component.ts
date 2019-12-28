import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Validators, FormControl} from '@angular/forms';
import { User, UserData } from '../authentication/user';
import { Router } from '@angular/router';
import { BasketService } from '../basket-service/basket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userdata = new UserData();
  

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwrdFormControl = new FormControl('', [Validators.required ]);
  
  constructor(private basketService: BasketService, public auth: AuthService) {
    
   }

  ngOnInit() {
  }

  
  checkIfUserIsCustomer(uid: string) {
   return this.auth.checkIfUserIsCustomer(uid);

  }

  signOut()
  {
    this.basketService.BasketCount = 0;
    this.auth.signOut();
  }

  signInWithEmail() {
        
    this.auth.signInRegular(this.userdata.email, this.userdata.pswrd ).then
    (
      res => this.basketService.getBasketData(res.user.uid)
    );
      
 }

}
