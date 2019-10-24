import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { basketItem } from '../basket/basket';
import { ProductServiceComponent } from '../product-service/product-service.component';
import { ICar } from './car';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BasketComponent } from '../basket/basket.component';
import { BasketService } from '../basket-service/basket.service';



@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  providers: [BasketService]
})

export class CarsComponent implements OnInit {
  
  arrCars: ICar[];
  filteredCars: ICar[];
  errorMessage: string;


  constructor(private httpService: HttpClient,
    private productService: ProductServiceComponent, 
    private basketService: BasketService,
    public test : BasketComponent) {

  }

  ngOnInit() {

    this.productService.getCars().subscribe(
      products => {
        this.arrCars = products,
          this.filteredCars = this.arrCars;
      },
      error => this.errorMessage = <any>error
    );

  }

  AddToBasket(carId: number) {

    this.basketService.addCarToBasket(this.productService.findCar(carId),1 );
    setTimeout(() => this.test.ngOnInit(),200);
  };

  performFilter(filterBy: string): ICar[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.arrCars.filter((car: ICar) =>
      car.brand.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}

