import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { RouteRoutingModule } from './route/route-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { BasketComponent } from './basket/basket.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BasketService } from './basket-service/basket.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductService } from './product-service/product.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    BasketComponent,
    LoginComponent,
    ProductsComponent,
    ProductDetailComponent, 
  ],
  imports: [
    BrowserModule,
    RouteRoutingModule,
    HttpClientModule
  ],
  providers: [ProductService, BasketComponent, BasketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
