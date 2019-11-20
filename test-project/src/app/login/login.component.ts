import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) {
    
   }

  ngOnInit() {
  }

  checkIfUserIsCustomer(uid: string) {
   return this.auth.checkIfUserIsCustomer(uid);

  }

}
