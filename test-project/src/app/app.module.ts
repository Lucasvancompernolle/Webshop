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
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatInputModule, MatProgressBarModule, MatCardModule , MatButtonModule, MatIconModule, MatCheckbox, MatCheckboxModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule} from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    BasketComponent,
    LoginComponent,
    ProductsComponent,
    ProductDetailComponent,
    RegisterComponent,
    CheckoutComponent,
    PaymentComponent,
    PageNotFoundComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouteRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features 
    AngularFireModule.initializeApp(environment.firebase, "Webshop"), BrowserAnimationsModule
  ],
  providers: [ProductService, BasketComponent, BasketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
