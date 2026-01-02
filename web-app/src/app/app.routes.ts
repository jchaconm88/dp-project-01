import { Routes } from '@angular/router';
import { NbAuthComponent, NbLogoutComponent, NbRequestPasswordComponent, NbResetPasswordComponent } from '@nebular/auth';
import { LoginComponent } from '@theme/pages/login/login.component';
import { RegisterComponent } from '@theme/pages/register/register.component';
import { RoleInfoComponent } from '@theme/pages/role/role-info/role-info.component';
import { RoleComponent } from '@theme/pages/role/role.component';
import { UserInfoComponent } from '@theme/pages/user/user-info/user-info.component';
import { UserComponent } from '@theme/pages/user/user.component';
import { ThemeComponent } from '@theme/theme.component';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/modules.routes').then(m => m.MODULES_ROUTES) },
  {
    path: 'core', component: ThemeComponent,
    children: [
      { path: 'user', component: UserComponent },
      { path: 'user/:id', component: UserInfoComponent },
      { path: 'role', component: RoleComponent },
      { path: 'role/:id', component: RoleInfoComponent },
    ],
  },
  {
    path: 'auth', component: NbAuthComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logout', component: NbLogoutComponent },
      { path: 'request-password', component: NbRequestPasswordComponent },
      { path: 'reset-password', component: NbResetPasswordComponent },
    ],
  }
];
