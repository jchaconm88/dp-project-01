import { ApplicationConfig, importProvidersFrom, Injectable, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { provideAnimations } from '@angular/platform-browser/animations';

import { NbThemeModule, NbSidebarModule, NbMenuModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider, NbAccessChecker } from '@nebular/security';
import { NbFirebasePasswordStrategy } from '@nebular/firebase-auth';
import { provideHttpClient } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginComponent } from './theme/components/login/login.component';
import { distinctUntilChanged, Observable, of as observableOf, shareReplay, startWith, tap } from 'rxjs';
import { RoleService } from './core/services/role.service';
import { RegisterComponent } from './theme/components/register/register.component';
import { AppAccessChecker } from './core/services/access.checker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@Injectable({ providedIn: 'root' })
export class NbSimpleRoleProvider extends NbRoleProvider {
  constructor(private roleService: RoleService) {
    super();
  }
  getRole(): Observable<string> {
    return this.roleService.getRole().pipe(
      distinctUntilChanged(),
      shareReplay(1)
    );
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    //base
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(
      //firebase -- Repetido por un error en Nebular
      AngularFireModule.initializeApp(environment.firebase),
      //nebular
      NbThemeModule.forRoot({ name: 'default' }),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbEvaIconsModule,
      NbLayoutModule,
      // Auth
      NbAuthModule.forRoot({
        strategies: [
          NbPasswordAuthStrategy.setup({
            name: 'password',
          }),
          NbFirebasePasswordStrategy.setup({
            name: 'firebase',
            token: {
              class: NbAuthJWTToken,
              key: 'token', // Clave donde se almacena el token en la respuesta de Firebase
            },
          }),
        ],
        forms: {
          logout: {
            redirectDelay: 0,
            redirect: { success: null, failure: null }, // 👈 sin redirección automática
          },
          login: {
            strategy: 'firebase',
            component: LoginComponent,
            rememberMe: false,
          },
          register: {
            strategy: 'firebase',
            component: RegisterComponent,
          },
        },
      }),
      // Security
      NbSecurityModule.forRoot({
        accessControl: {
          guest: {
            view: 'guest'
          },
          user: {
            parent: 'guest',
            view: 'user',
            create: '*',
            edit: '*',
            remove: '*',
          },
          transport: {
            parent: 'user',
            view: 'transport',
            create: '*',
            edit: '*',
            remove: '*',
          },
          admin: {
            parent: 'user',
            view: '*',
            create: '*',
          }
        },
      })
    ),
    { provide: NbRoleProvider, useClass: NbSimpleRoleProvider },
    { provide: NbAccessChecker, useExisting: AppAccessChecker },
    { provide: NbFirebasePasswordStrategy, useClass: NbFirebasePasswordStrategy },
    //PrimeNg
    provideAnimationsAsync()
  ]
};
