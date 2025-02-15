// Importation des modules nécessaires d'Angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

// Importation des modules de routage et des composants
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DetailsComponent } from './components/detail/detail.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavComponent } from './components/nav/nav.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PharmacyManagementComponent } from './components/pharmacy-management/pharmacy-management.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    // Déclaration des composants utilisés dans l'application
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    NavComponent,
    ProductsComponent,
    DetailsComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    PharmacyManagementComponent,
    FooterComponent,
    NotificationComponent,
  ],
  imports: [
    // Importation des modules nécessaires pour le fonctionnement de l'application
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent], // Composant principal de l'application
})
export class AppModule {}
