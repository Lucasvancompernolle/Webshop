import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})


export class CarDetailComponent implements OnInit {

public carId: number;

  constructor(private route: ActivatedRoute, private httpService: HttpClient) { }

  ngOnInit() {
  let id = parseInt(this.route.snapshot.paramMap.get('id'));
  this.carId = id;
  }

  PutInBasket()
  {
    this.httpService.post('../assets/dummyDataBasket.json', {
      title: 'foo',
      body: 'bar',
      userId: this.carId
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }
  


}

