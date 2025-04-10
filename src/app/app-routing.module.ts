import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'adoracion',
    loadChildren: () => import('./ministerio-adoracion/ministerio-adoracion.module').then(m => m.MinisterioAdoracionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'multimedia',
    loadChildren: () => import('./ministerio-multimedia/ministerio-multimedia.module').then(m => m.MinisterioMultimediaModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }