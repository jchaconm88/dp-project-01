import { Component, OnInit } from '@angular/core';
import { DefaultLayoutComponent } from '../theme/layout/default/default.layout';
import { NbMenuItem, NbMenuModule, NbIconModule } from '@nebular/theme';
import { RouterOutlet } from '@angular/router';
import { NbAccessChecker, NbRoleProvider } from '@nebular/security';
import { filter, firstValueFrom, forkJoin, map, Observable, of, take, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FirebaseMenuItem } from '../core/interfaces/firebase-menu-item';
import { RoleService } from '../core/services/role.service';
import { NbAuthService } from '@nebular/auth';
import { MENU_ITEMS } from './pages-menu';

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

export class PagesComponent implements OnInit {
  menuItems: NbMenuItem[] = [];
  constructor(private authService: NbAuthService, private accessChecker: NbAccessChecker, private roleProvider: NbRoleProvider, private roleService: RoleService) { }

  async ngOnInit() {
    try {
      // 1. Espera a que el rol esté completamente cargado
      //await this.roleService.waitForRoleLoad();
        
      await firstValueFrom(
        this.roleProvider.getRole().pipe(
          filter(role => role !== 'guest'), // Ignora el estado inicial
          take(1),
          timeout(5000)
      ))

      // Filtra primero los items habilitados
      const enabledItems = MENU_ITEMS.filter(item => item.enabled);

      // Mapea asyncronamente cada item
      this.menuItems = await Promise.all(
        enabledItems.map(item => this.mapFirebaseItemToNbMenuItem(item))
      );
    } catch (error) {
      console.error('Error loading menu:', error);
      this.menuItems = []; // Asigna un array vacío en caso de error
    }
  }

  private async mapFirebaseItemToNbMenuItem(firebaseItem: FirebaseMenuItem): Promise<NbMenuItem> {
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