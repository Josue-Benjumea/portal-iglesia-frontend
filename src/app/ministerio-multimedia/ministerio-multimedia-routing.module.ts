import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarRepertoriosComponent } from './listar-repertorios/listar-repertorios.component';
import { EditarDiapositivasComponent } from './editar-diapositivas/editar-diapositivas.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  {
    path: 'listar-repertorios',
    component: ListarRepertoriosComponent,
    canActivate: [RoleGuard],
    data: { ministerio: 'Ministerio de multimedia' }
  },
  {
    path: 'editar-diapositivas',
    component: EditarDiapositivasComponent,
    canActivate: [RoleGuard],
    data: { ministerio: 'Ministerio de multimedia' }
  },
  { path: '', redirectTo: 'listar-repertorios', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinisterioMultimediaRoutingModule { }
