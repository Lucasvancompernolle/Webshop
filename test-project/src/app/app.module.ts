import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CarsComponent } from './cars/cars.component';
import { HomeComponent } from './home/home.component';
import { RouteRoutingModule } from './route/route-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { PartsComponent } from './parts/parts.component';
import { BasketComponent } from './basket/basket.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { ProductServiceComponent } from './product-service/product-service.component';

@NgModule({
  declarations: [
    AppComponent,
    CarsComponent,
    HomeComponent,
    NavigationComponent,
    PartsComponent,
    BasketComponent,
    LoginComponent,
    CarDetailComponent,
    ProductServiceComponent
  ],
  imports: [
    BrowserModule,
    RouteRoutingModule,
    HttpClientModule
  ],
  providers: [ProductServiceComponent, BasketComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
