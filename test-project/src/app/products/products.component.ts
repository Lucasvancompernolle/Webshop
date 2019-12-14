import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Product } from '../product-service/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BasketComponent } from '../basket/basket.component';
import { BasketService } from '../basket-service/basket.service';
import { ProductService } from '../product-service/product.service';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [BasketService]
})

export class ProductsComponent implements OnInit {

  products: Observable<Product[]>;
  
  constructor(private productService: ProductService,
    private basketService: BasketService,
    private basket: BasketComponent) {

  }

  ngOnInit() {

    this.productService.getProducts();
    this.products = this.productService.products;

  }

  AddToBasket(productId: number) {

    let user = this.productService.auth.userDetails();
    this.basketService.addProductToBasket(this.productService.findProduct(productId), 1, user.uid);
    setTimeout(() => this.basket.ngOnInit(), 100);
  };

  DeleteProduct(prodId: number) {
    this.productService.DeleteProduct(prodId);

  }

  // performFilter(filterBy: string): Product[] {
  //   filterBy = filterBy.toLocaleLowerCase();
  //   return this.products.filter((product: Product) =>
  //   product.brand.toLocaleLowerCase().indexOf(filterBy) !== -1);
  // }

}

