import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})


export class CarsComponent implements OnInit {

  arrCars: string[];

  constructor(private httpService: HttpClient) { }

  ngOnInit() {
    this.httpService.get('../assets/dummyData.json').subscribe(
      data => {
        this.arrCars = data as string [];	 // FILL THE ARRAY WITH DATA.
          console.log(this.arrCars[1]);
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );
  }

}
