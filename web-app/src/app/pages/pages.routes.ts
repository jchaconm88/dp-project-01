import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
    ]
  },
  {
    path: 'home',
    component: PagesComponent,
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
    ]
  },
  {
    path: 'system',
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      { path: 'user', loadComponent: () => import('./system/user/user.component').then(m => m.UserComponent) }
    ]
  }
];