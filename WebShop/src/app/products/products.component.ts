import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Product } from '../product-service/product';
import { BasketComponent } from '../basket/basket.component';
import { BasketService } from '../basket-service/basket.service';
import { ProductService } from '../product-service/product.service';
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

  AddToBasket(productId: number, qtyOrder: number) {

    if(qtyOrder == 0)
    {
      alert("Quantity must be at least 1!");
      return;
    }

    let user = this.productService.auth.userDetails();
    this.basketService.addProductToBasket(this.productService.findProduct(productId), qtyOrder, user.uid);
    setTimeout(() => this.basket.ngOnInit(), 100);
  };

  DeleteProduct(prodId: number) {
    this.productService.DeleteProduct(prodId);

  }

  performFilter(filterBy: string) {
   
    this.productService.filterProducts(filterBy);
    this.products = this.productService.products;
    
    
  }

  filterProductsPrice(filterBy: string) {
   

    this.productService.filterProductsPrice(filterBy);
    this.products = this.productService.products;
  }

}

