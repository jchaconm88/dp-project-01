import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { ThemeComponent } from '@theme/theme.component';
import { SYSTEM_ROUTES } from '@system/system.routes';
import { MASTER_ROUTES } from '@master/master.routes';

export const MODULES_ROUTES: Routes = [
  {
    path: '',
    component: ThemeComponent,
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
    ]
  },
  {
    path: 'home',
    component: ThemeComponent,
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
    ]
  },
  {
    path: 'system',
    canActivate: [AuthGuard],
    component: ThemeComponent,
    children: SYSTEM_ROUTES
  },
  {
    path: 'master',
    canActivate: [AuthGuard],
    component: ThemeComponent,
    children: MASTER_ROUTES
  }
];