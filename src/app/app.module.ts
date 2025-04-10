import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Asegúrate de importar el NavbarComponent en todos los módulos que lo necesiten
import { NavbarComponent } from './shared/navbar/navbar.component';

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    MatSnackBarModule,
    NavbarComponent
  ]
})
export class AppModule { }