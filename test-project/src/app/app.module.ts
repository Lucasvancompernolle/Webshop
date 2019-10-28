import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
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
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    BasketComponent,
    LoginComponent,
    ProductsComponent,
    ProductDetailComponent,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features 
  ],
  imports: [
    BrowserModule,
    RouteRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, "Webshop")
  ],
  providers: [ProductService, BasketComponent, BasketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
