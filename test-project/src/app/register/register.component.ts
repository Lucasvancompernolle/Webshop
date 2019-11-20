import { Component, OnInit } from '@angular/core';
import { Customer } from '../authentication/Customer';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  
  value;
 
  customer: Customer;

  firstname: string = "";
 
  phoneNumber: string

  constructor(private _formBuilder: FormBuilder) {
    this.customer = new Customer;
   }

   ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  CreateCustomer()
  {
    
  }

  

}
