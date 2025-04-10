import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarCancionesComponent } from './buscar-canciones/buscar-canciones.component';
import { CrearRepertorioComponent } from './crear-repertorio/crear-repertorio.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  {
    path: 'buscar-canciones',
    component: BuscarCancionesComponent,
    canActivate: [RoleGuard],
    data: { ministerio: 'Ministerio de alabanza' }
  },
  {
    path: 'crear-repertorio',
    component: CrearRepertorioComponent,
    canActivate: [RoleGuard],
    data: { ministerio: 'Ministerio de alabanza' }
  },
  { path: '', redirectTo: 'buscar-canciones', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinisterioAdoracionRoutingModule { }
