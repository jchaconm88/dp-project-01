import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
    ]
  },
  {
    path: 'system',
    component: PagesComponent,
    children: [
      { path: 'user', loadComponent: () => import('./system/user/user.component').then(m => m.UserComponent) }
    ]
  }
];