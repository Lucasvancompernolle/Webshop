import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Validators, FormControl} from '@angular/forms';
import { User, UserData } from '../authentication/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userdata = new UserData();
  pssword;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwrdFormControl = new FormControl('', [Validators.required ]);
  
  constructor(private router: Router, public auth: AuthService) {
    
   }

  ngOnInit() {
  }

  
  checkIfUserIsCustomer(uid: string) {
   return this.auth.checkIfUserIsCustomer(uid);

  }

  signInWithEmail() {
    // console.log(this.user.email + '   ' +  this.user.pswrd)
    this.auth.signInRegular(this.userdata).then
    (
     // res => this.router.navigate(["/"])
    );
      
 }

}
