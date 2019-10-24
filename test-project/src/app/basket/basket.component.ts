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

  basketItems: basketItem[] = [];
  errorMessage;

  constructor(private httpService: HttpClient, private basketService: BasketService) {

  }

  ngOnInit() {
    this.basketService.getBasketData();
    this.basketService.basketItems.subscribe(data => this.basketItems = data);
    
  }

  // getData() {
  //    this.basketService.getBasketData().subscribe(
  //     data => {this.basketItems = data,
  //     console.log("data OK")
  //     }
  //   );
  // }

  test() {
    this.basketService.next();
  }

  deleteSelectedItems() {


    // this.basketService._proposals = this.basketService._proposals.filter(a => {
    //   a.delete == false)
    // ; // or whatever
    this.basketService.deleteItem();
    this.ngOnInit();
    // for (var i = this.basketItems.length - 1; i >= 0; i--) {
    //   if (this.basketItems[i].delete) {
    //     console.log(this.basketItems[i].productBrand + " deleted");
    //     this.basketService.deleteItem(this.basketItems[i].id).subscribe();
    //     this.basketItems.splice(i,1)
    //   }
    // }
  }

}
