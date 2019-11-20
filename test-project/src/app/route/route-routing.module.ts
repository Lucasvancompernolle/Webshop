import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BasketComponent } from '../basket/basket.component';
import { LoginComponent } from '../login/login.component';
import { ProductsComponent } from '../products/products.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { AuthGuard } from '../authentication/auth.guard';
import { RegisterComponent } from '../register/register.component';


const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent },
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }

