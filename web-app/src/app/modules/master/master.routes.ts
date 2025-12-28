import { Routes } from '@angular/router';

export const MASTER_ROUTES: Routes = [
    { path: 'material', loadComponent: () => import('./pages/material/material.component').then(m => m.MaterialComponent) },
    { path: 'material/:id', loadComponent: () => import('./pages/material/material-info/material-info.component').then(m => m.MaterialInfoComponent) },
];