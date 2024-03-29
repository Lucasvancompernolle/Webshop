import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BasketComponent } from '../basket/basket.component';
import { LoginComponent } from '../login/login.component';
import { ProductsComponent } from '../products/products.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { AuthGuard } from '../authentication/auth.guard';
import { RegisterComponent } from '../register/register.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { PaymentComponent } from '../payment/payment.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AdminComponent } from '../admin/admin.component';
import { UploadExcelComponent } from '../upload-excel/upload-excel.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { OrderComponent } from '../order/order.component';
import { CustomerComponent } from '../customer/customer.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent },
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'payment', component: PaymentComponent, canActivate: [AuthGuard]},
  {path: 'products', component: ProductsComponent},
  {path: 'products/:id', component: ProductDetailComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
  {path: 'pageNotFound', component: PageNotFoundComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'orders', component: OrderComponent, canActivate: [AuthGuard]},
  {path: 'customers', component: CustomerComponent, canActivate: [AuthGuard]},
  {path: 'uploadExcel', component: UploadExcelComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }

