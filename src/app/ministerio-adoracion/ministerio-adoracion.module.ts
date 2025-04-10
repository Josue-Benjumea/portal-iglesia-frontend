import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinisterioAdoracionRoutingModule } from './ministerio-adoracion-routing.module';
import { BuscarCancionesComponent } from './buscar-canciones/buscar-canciones.component';
import { CrearRepertorioComponent } from './crear-repertorio/crear-repertorio.component';

@NgModule({
  imports: [
    CommonModule,
    MinisterioAdoracionRoutingModule,
    BuscarCancionesComponent,
    CrearRepertorioComponent
  ]
})
export class MinisterioAdoracionModule { }
