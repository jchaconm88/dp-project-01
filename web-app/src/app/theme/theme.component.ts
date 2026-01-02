import { Component, OnDestroy, OnInit } from '@angular/core';
import { DefaultLayoutComponent } from '../theme/layout/default/default.layout';
import { NbMenuItem, NbMenuModule, NbIconModule } from '@nebular/theme';
import { RouterOutlet } from '@angular/router';
import { NbAccessChecker, NbRoleProvider } from '@nebular/security';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RoleService } from '../core/services/role.service';
import { MENU_ITEMS } from './data/pages-menu';
import { RoleAccessService } from '../core/services/role-access.service';
import { MenuItem } from './models/menu-item.model';

@Component({
  selector: 'app-pages',
  imports: [
    CommonModule,
    NbMenuModule,
    NbIconModule,
    RouterOutlet,
    DefaultLayoutComponent
  ],
  template: `
    <default-layout>
      <nb-menu [items]="menuItems">
      </nb-menu>
      <router-outlet></router-outlet>
    </default-layout>
  `,
})

export class ThemeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  menuItems: NbMenuItem[] = [];
  constructor(private accessChecker: NbAccessChecker, private roleProvider: NbRoleProvider, private roleAccess: RoleAccessService, private roleService: RoleService) { }

  async ngOnInit() {
    try {
      this.roleService.roleGetCurrent()
        .pipe(takeUntil(this.destroy$))
        .subscribe(async role => {
          console.log('Rol detectado en PagesComponent:', role);
          // Filtra primero los items habilitados
          const enabledItems = MENU_ITEMS.filter(item => item.enabled);
          this.menuItems = await Promise.all(
            enabledItems.map(item => this.mapFirebaseItemToNbMenuItem(item))
          );
        });
      // this.roleProvider.getRole()
      //   .pipe(
      //     distinctUntilChanged(),
      //     filter(role => !!role),
      //     takeUntil(this.destroy$)
      //   )
      //   .subscribe(async role => {
      //     console.log('Rol detectado:', role);
      //     // Filtra primero los items habilitados
      //     const enabledItems = MENU_ITEMS.filter(item => item.enabled);

      //     // Mapea asyncronamente cada item
      //     this.menuItems = await Promise.all(
      //       enabledItems.map(item => this.mapFirebaseItemToNbMenuItem(item))
      //     );
      //   });
    } catch (error) {
      console.error('Error loading menu:', error);
      this.menuItems = []; // Asigna un array vacío en caso de error
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async mapFirebaseItemToNbMenuItem(firebaseItem: MenuItem): Promise<NbMenuItem> {
    // Evaluar permiso si existe
    let isVisible = firebaseItem.permission
      ? await firstValueFrom(this.accessChecker.isGranted(firebaseItem.permission[0], firebaseItem.permission[1]))
      : true;

    // Procesar hijos recursivamente si existen
    let children: NbMenuItem[] | undefined;
    if (firebaseItem.children) {
      children = await Promise.all(
        firebaseItem.children.map(child => this.mapFirebaseItemToNbMenuItem(child))
      );
    }

    return {
      title: firebaseItem.title,
      icon: firebaseItem.icon,
      link: firebaseItem.link,
      pathMatch: firebaseItem.pathMatch as 'full' | 'prefix' | undefined,
      home: firebaseItem.home,
      group: firebaseItem.group,
      children,
      hidden: !isVisible
    };
  }
}