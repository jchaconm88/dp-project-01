import { Routes } from '@angular/router';
import { NbAuthComponent, NbLoginComponent, NbLogoutComponent, NbRegisterComponent, NbRequestPasswordComponent, NbResetPasswordComponent } from '@nebular/auth';
import { LoginComponent } from './theme/components/login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './theme/components/register/register.component';

export const routes: Routes = [
    { path: '', 
      canActivate: [AuthGuard],
      loadChildren: () => import('./pages/pages.routes').then(m => m.AUTH_ROUTES) }, 
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
          {
            path: '',
            component: LoginComponent,
          },
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'register',
            component: RegisterComponent,
          },
          {
            path: 'logout',
            component: NbLogoutComponent,
          },
          {
            path: 'request-password',
            component: NbRequestPasswordComponent,
          },
          {
            path: 'reset-password',
            component: NbResetPasswordComponent,
          },
        ],
      }
];
