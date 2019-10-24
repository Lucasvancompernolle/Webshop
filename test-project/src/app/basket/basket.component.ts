import { Component, OnInit } from '@angular/core';
import { basketItem } from './basket';
import { ICar } from '../cars/car';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { BasketService } from '../basket-service/basket.service';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {


  constructor( private basketService: BasketService) {

  }

  ngOnInit() {
    this.basketService.getBasketData();
  }

  deleteSelectedItems() {

    this.basketService.deleteItem();
    setTimeout(() => this.ngOnInit(),100);
  }

}
