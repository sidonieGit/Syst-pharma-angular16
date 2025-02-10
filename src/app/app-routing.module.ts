import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './components/detail/detail.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { PharmacyManagementComponent } from './components/pharmacy-management/pharmacy-management.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { UserRole } from './services/auth.service';
import { FooterComponent } from './components/footer/footer.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: HomePageComponent,
  //   canActivate: [authGuard],
  //   data: { role: UserRole.Client },
  // },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: UserRole.Admin },
  },
  {
    path: 'pharmacy-management',
    component: PharmacyManagementComponent,
    canActivate: [authGuard],
    data: { role: UserRole.Agent },
  },
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
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'pharmacy-management', component: PharmacyManagementComponent },
  { path: 'footer', component: FooterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
