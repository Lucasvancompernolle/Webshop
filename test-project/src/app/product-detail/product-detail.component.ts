import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})


export class ProductDetailComponent implements OnInit {

public productId: number;

  constructor(private route: ActivatedRoute, private httpService: HttpClient) { }

  ngOnInit() {
  let id = parseInt(this.route.snapshot.paramMap.get('id'));
  this.productId = id;
  }

  PutInBasket()
  {
    this.httpService.post('../assets/dummyDataBasket.json', {
      title: 'foo',
      body: 'bar',
      userId: this.productId
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

