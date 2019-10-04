import { Component, OnInit } from '@angular/core';
import { ICar } from '../cars/car';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-service',
  templateUrl: './product-service.component.html',
  styleUrls: ['./product-service.component.css']
})
export class ProductServiceComponent implements OnInit {

  private cars: ICar[];
  private parts: any[];
  private getCarsUrl = '../assets/dummyData.json';

  constructor(private httpService: HttpClient) {
   this.getCars().subscribe(
      products => {
        this.cars = products
      }
    );
  }

  getCars(): Observable<ICar[]> {
    return this.httpService.get<ICar[]>(this.getCarsUrl, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      tap(cars => console.log("all " + JSON.stringify(cars))),
      catchError(this.handleError));

  }

  findCar(carId: number): ICar  {
   
    for (var i = this.cars.length - 1; i >= 0; i--) {
      if (this.cars[i].id == carId) {
        console.log(this.cars[i].id + " found");
        return this.cars[i];
      }
    }
    return this.cars.find(p => p.id === carId);
  }


  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code ${err.status}, error message is ${err.message}.`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);

  }

  ngOnInit() {

  }
}



