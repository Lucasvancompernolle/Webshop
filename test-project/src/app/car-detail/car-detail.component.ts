import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})

// export class Car{
//   Id: number;
//   brand: string;
//   info: string;
//   price: number;
//   description: string;
//   ScoreRating: number;
// }

export class CarDetailComponent implements OnInit {

public carId: number;

  constructor(private route: ActivatedRoute, private httpService: HttpClient) { }

  ngOnInit() {
  let id = parseInt(this.route.snapshot.paramMap.get('id'));
  this.carId = id;
  }

}

