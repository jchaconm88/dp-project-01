import { Component, inject } from '@angular/core';
import { NbActionsModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbMediaBreakpointsService, NbMenuService, NbSearchModule, NbSelectModule, NbSidebarService, NbThemeService, NbUserModule } from '@nebular/theme';
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
    NbContextMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router)
  private nbMenuService = inject(NbMenuService)
  private themeService = inject(NbThemeService);
  private authService = inject(NbAuthService);
  private breakpointService = inject(NbMediaBreakpointsService)
  private sidebarService = inject(NbSidebarService)
  private menuService = inject(NbMenuService)
  private destroy$: Subject<void> = new Subject<void>();
  user: firebase.User | null = null;
  userPictureOnly: boolean = false;

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
    this.currentTheme = this.themeService.currentTheme;

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user-menu'), // Filtra por el tag del menú
        map(({ item }) => item),
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

  private logout() {
    console.log('logout')
    this.authService.logout('firebase') // 'email' debe coincidir con el nombre de tu estrategia
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login'], { replaceUrl: true });
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
        },
      });
  }
}
