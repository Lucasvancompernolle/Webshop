import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer/Customer';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../authentication/auth.service';
import { RegisterService } from '../register-service/register.service';
import { ErrorStateMatcher } from '@angular/material';
import { User, UserData } from '../authentication/user';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fourthFormGroupPswrd: FormGroup;
  customer: Customer;
  custPswrd: string;
  matcher = new MyErrorStateMatcher();

  userdata: UserData;


  constructor(private router: Router, private _formBuilder: FormBuilder, private auth: AuthService, private regService: RegisterService) {
    this.customer = new Customer;
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl1: ['', Validators.required],
      firstCtrl2: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl1: ['', Validators.required],
      secondCtrl2: ['', Validators.required],
      secondCtrl3: ['', Validators.required],
      secondCtrl4: ['', Validators.required],
      secondCtrl5: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl1: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl1: ['', [
        Validators.required,
        Validators.email,
      ]],
      fourthCtrl2: ['', [Validators.required]],
      fourthCtrl3: ['', [Validators.required]]
    }, { validator: this.checkPasswords});

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.fourthCtrl2.value;
    let confirmPass = group.controls.fourthCtrl3.value;
    return pass == confirmPass ? null : { notSame: true }
  }

  CreateCustomer() {
    this.userdata = new UserData()

    this.userdata.admin = false;
    this.userdata.displayName = this.customer.firstName;
    this.userdata.email = this.customer.email;
    this.userdata.name = this.customer.firstName + " " + this.customer.lastName;
    this.userdata.pswrd = this.custPswrd;


    this.auth.createAccount(this.userdata)
      .then(res => {

        this.auth.signInNewUser(this.userdata)
        var user = this.auth.afAuth.auth.currentUser;
        this.customer.custId = user.uid;
        this.regService.createNewCustomer(this.customer);
        this.router.navigate(["/"]);
      })
      .catch(err => alert(err.message));

  }

}


