import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CarsComponent } from '../cars/cars.component';
import { PartsComponent } from '../parts/parts.component';
import { BasketComponent } from '../basket/basket.component';
import { LoginComponent } from '../login/login.component';
import { CarDetailComponent } from '../car-detail/car-detail.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'cars', component: CarsComponent },
  {path: 'parts', component: PartsComponent },
  {path: 'basket', component: BasketComponent },
  {path: 'login', component: LoginComponent },
  {path: 'cars/:id', component: CarDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }

