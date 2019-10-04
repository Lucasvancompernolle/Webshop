import { Component, OnInit } from '@angular/core';

import { basketItem } from '../basket/basket';
import { ProductServiceComponent } from '../product-service/product-service.component';
import { ICar } from './car';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BasketComponent } from '../basket/basket.component';


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})


export class CarsComponent implements OnInit {

  arrCars: ICar[];
  filteredCars: ICar[];
  errorMessage: string;

  constructor(private httpService: HttpClient,
    private productService: ProductServiceComponent,
    private basket: BasketComponent) {

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

    this.basket.addCarToBasket(this.productService.findCar(carId),1 )
    
  };



  performFilter(filterBy: string): ICar[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.arrCars.filter((car: ICar) =>
      car.brand.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}

