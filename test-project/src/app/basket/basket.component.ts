import { Component, OnInit } from '@angular/core';
import { basketItem } from './basket';
import { ICar} from '../cars/car';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

   basketItems: basketItem[];

  constructor(private httpService: HttpClient) { }

  ngOnInit() {

    this.httpService.get('../assets/dummyDataBasket.json').subscribe(
      data => {
        this.basketItems = data as basketItem[];	
        console.log(this.basketItems[1]);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );

  }

  addCarToBasket(car:ICar, qty: number)
  {
    let item = new basketItem();
    item.id = car.id
    item.item = car.brand
    item.price = car.price
    item.quantity = qty
    item.delete = false;
    this.basketItems.push(item);
  }

  deleteSelectedItems() {

    for (var i = this.basketItems.length - 1; i >= 0; i--) {
      if (this.basketItems[i].delete) {
        console.log(this.basketItems[i].item + " deleted");
        this.basketItems.splice(this.basketItems.indexOf(this.basketItems[i]), 1);
      }
    }
  }

}
