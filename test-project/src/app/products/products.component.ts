import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Product } from '../product-service/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BasketComponent } from '../basket/basket.component';
import { BasketService } from '../basket-service/basket.service';
import { ProductService } from '../product-service/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [BasketService ]
})

export class ProductsComponent implements OnInit {
  
  


  constructor(private productService: ProductService, 
    private basketService: BasketService,
    private basket : BasketComponent) {

  }

  ngOnInit() {

    this.productService.getProducts();

  }

  AddToBasket(productId: number) {

    this.basketService.addCarToBasket(this.productService.findProduct(productId),1 );
    setTimeout(() => this.basket.ngOnInit(),100);
  };

  // performFilter(filterBy: string): Product[] {
  //   filterBy = filterBy.toLocaleLowerCase();
  //   return this.products.filter((product: Product) =>
  //   product.brand.toLocaleLowerCase().indexOf(filterBy) !== -1);
  // }

}

