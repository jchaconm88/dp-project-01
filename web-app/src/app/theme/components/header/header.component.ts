import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbMediaBreakpointsService, NbMenuService, NbSearchModule, NbSelectModule, NbSidebarService, NbThemeService, NbUserModule } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService, NbAuthToken } from '@nebular/auth';
import firebase from 'firebase/compat/app';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  imports: [ 
    CommonModule,
    NbLayoutModule,
    NbActionsModule,
    NbSelectModule,
    NbIconModule,
    NbSearchModule,
    NbUserModule,
    NbContextMenuModule,
    NbButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private router = inject(Router)
  private nbMenuService = inject(NbMenuService)
  private themeService = inject(NbThemeService);
  private authService = inject(NbAuthService);
  private breakpointService = inject(NbMediaBreakpointsService)
  private sidebarService = inject(NbSidebarService)
  private menuService = inject(NbMenuService)
  user: firebase.User | null = null;
  userPictureOnly: boolean = false;
  private hasReloaded = false;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  currentTheme = 'default';
  userMenu = [ { title: 'Profile' }, { title: 'Cerrar sesión' } ];

  ngOnInit() {
    console.log('ngOnInit ejecutado');
    this.currentTheme = this.themeService.currentTheme;

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user-menu'), // Filtra por el tag del menú
        map(({ item }) => item),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        if (item.title === 'Cerrar sesión') {
          this.logout(); // Ejecuta logout al hacer clic
        }
      });
    
    this.authService.onTokenChange() // Escucha cambios en el token
      .pipe(
        filter((token: NbAuthToken): token is NbAuthJWTToken => token instanceof NbAuthJWTToken),
        filter((token: NbAuthJWTToken) => token.isValid())
      )
      .subscribe((token: NbAuthJWTToken) => {
        this.user = token.getPayload(); // Extrae datos del payload del token
      });

    // this.authService.onTokenChange().subscribe(token => {
    //     if (token.isValid()) {
    //       const firebaseUser = token.getPayload();
    //       console.log('firebase-user', firebaseUser)
    //       // this.firestore.doc(`usuarios/${firebaseUser.user_id}`).get().subscribe(doc => {
    //       //   if (!doc.exists) {
    //       //     this.firestore.doc(`usuarios/${firebaseUser.user_id}`).set({
    //       //       email: firebaseUser.email,
    //       //       creado: new Date(),
    //       //       roles: ['user']
    //       //     });
    //       //   }
    //       // });
    //       this.user = firebaseUser;
    //     }
    //   });

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    console.log(themeName)
    this.themeService.changeTheme(themeName);
    // const body = document.body;
    // body.classList.remove('default-theme', 'dark-theme', 'cosmic-theme', 'corporate-theme');
    // body.classList.add(`${themeName}-theme`);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    //this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  login() {
    this.router.navigate(['/auth/login'], { replaceUrl: true })
  }

  private logout() {
    console.log('logout')
    this.authService.logout('firebase') // 'email' debe coincidir con el nombre de tu estrategia
      .subscribe({
        next: () => {
          this.navigateHome()          
          
          // const currentUrl = this.router.url.split('?')[0];
          // if (currentUrl === '/' || currentUrl === '') {
          //   this.router
          //     .navigateByUrl('/auth/login', { skipLocationChange: true }) // navega "fuera" sin cambiar la URL
          //     .then(() => this.router.navigate(['/'])); // vuelve a la raíz
          // } else {
          //   // Si no estás en la raíz, simplemente navega
          //   this.router.navigate(['/']);
          // }
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
        },
      });
  }
}
