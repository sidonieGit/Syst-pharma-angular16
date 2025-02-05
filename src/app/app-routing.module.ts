import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './components/detail/detail.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  //   canActivate: [authGuard],
  // }, // Protégé par le guard
  // { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  // { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  // { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'detail/:id',
    component: DetailsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
