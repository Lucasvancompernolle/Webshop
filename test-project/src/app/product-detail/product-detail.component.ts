import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../product-service/product.service';
import { Product } from '../product-service/product';
import { FormBuilder, Validators } from '@angular/forms';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { BasketService } from '../basket-service/basket.service';
import { BasketComponent } from '../basket/basket.component';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})


export class ProductDetailComponent implements OnInit {


  ProductItem: Product;
  ProductForm;
  productId: number;
  IsReadOnly: boolean = true;
  ProductQty: number = 1;
  newProductMode: boolean = false;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private basketService: BasketService,
    private basket: BasketComponent,
    private formBuilder: FormBuilder) {



    this.ProductItem = new Product;
    this.ProductForm = this.formBuilder.group({
      brand: ['', Validators.required],
      name: ['', Validators.required],
      sku: ['', Validators.required],
      price:[0, Validators.required, ],
      description: ['', Validators.required],
      ratingScore: 0,
      picturePath: '',
      countryOfOrigin: '',
      productGroup: ['', Validators.required],
      qtyOnStock: 0,
      SalesUnit: ['', Validators.required]
    });

  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.productId = id;

    this.productService.auth.user.subscribe(
      () => {
        this.productService.auth.userData.subscribe(
          data => this.IsReadOnly = data.admin ? false : true
        )
      }
    );

    if (id == 0) {
      this.newProductMode = true;
    }
    else {

      this.productService.getProductItemById(id).subscribe(
        data => {
          this.ProductItem = data as Product;
          this.ProductForm.setValue({
            brand: data.brand,
            name: data.name,
            sku: data.sku,
            price: data.price,
            description: data.description,
            ratingScore: data.ratingScore,
            picturePath: data.picturePath,
            countryOfOrigin: data.countryOfOrigin,
            productGroup: data.productGroup,
            qtyOnStock: data.qtyOnHand,
            SalesUnit: data.salesUnit
          });
        }
      );
    }


  }

  onSubmit(Product) {
    // Process update product
    if(this.newProductMode == false)
    {
    this.productService.UpdateProduct(this.productId, Product).subscribe(
      updatedProduct => {
        this.ProductItem = updatedProduct;
        console.warn('Your product has been updated!', Product);
        alert('Your product has been updated');
      }
    );
    }
    else{
      this.productService.AddProduct(Product).subscribe(
        addedProduct => {
          this.ProductItem = addedProduct;
          console.warn('Your product has been added!', Product);
          alert('Your product has been added');
        }
      );
    }

  }

  AddToBasket() {
    let user = this.productService.auth.userDetails();
    this.basketService.addProductToBasket(this.ProductItem, this.ProductQty, user.uid);
    this.ProductQty = 1;
    setTimeout(() => this.basket.ngOnInit(), 100);
  }


}

