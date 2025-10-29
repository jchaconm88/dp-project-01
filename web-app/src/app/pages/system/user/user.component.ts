import { Component, computed, effect, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ContentComponent } from '../../../theme/controls/content/content.component';
import { TableComponent } from '../../../theme/controls/table/table.component';
import { AppTableDefDetail } from '../../../theme/models/app-table-def-detail';
import { SystemService } from '../../../core/services/system.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';
import { firstValueFrom, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Router } from '@angular/router';
import { ContentHeaderComponent } from '../../../theme/controls/content-header/content-header.component';
import { NbAccessChecker } from '@nebular/security';
import { RoleAccessService } from '../../../core/services/role-access.service';
import { RoleService } from '../../../core/services/role.service';
import { NbWindowService } from '@nebular/theme';
import { UserSetComponent } from './user-set/user-set.component';

interface User {
  id: string
  email: string
  displayName: number
}

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    ContentComponent,
    ContentHeaderComponent,
    TableComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(TableComponent, { static: true }) table: TableComponent = new TableComponent;
  @ViewChild(ContentComponent, { static: true }) content: ContentComponent = new ContentComponent;
  private systemService = inject(SystemService);
  tableDef: AppTableDefDetail[] = [
    { header: 'Nombre', column: 'displayName', order: 1, display: true, filter: true },
    { header: 'Correo', column: 'email', order: 2, display: true, filter: true }
  ]
  showSelect: boolean = true
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private accessChecker: NbAccessChecker, private roleService: RoleService, private windowService: NbWindowService) {
  }

  ngOnInit() {
    console.log('UserComponent: ngOnInit');
    this.load();
  }

  async load() {
    try {      
      this.table.setDatasource([])
      this.roleService.currentRole$
        .pipe(takeUntil(this.destroy$))
        .subscribe(async role => {
          console.log('Rol detectado en UserComponent:', role);
          const canList = await firstValueFrom(this.accessChecker.isGranted('list', 'user'))
          if (canList) {
            console.log('Acceso concedido a la lista de usuarios.');
            this.content.showAlert = false
            this.systemService.userGetList()
              .pipe(takeUntil(this.destroy$))
              .subscribe(users => {
                console.log('Usuarios cargados:', users);
                this.table.setDatasource(users)
              });
          }
          else {
            console.log('Acceso denegado a la lista de usuarios.');
            this.content.showAlertMessage('Acceso denegado a la lista de usuarios.');
          }
        });
      
    } catch (error) {
      console.log(error)
      this.content.showAlertMessage(error as string);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  create() {
    this.windowService.open(UserSetComponent, { title: `Agregar Usuario` });
  }

  detail(userId: string): void {
    console.log('Mostrando usuario:', userId);
    this.router.navigate(['/system/user', userId]);
  }

  delete() {

  }

  deleteDisabled(): boolean {
    const selected = this.table.getSelectedRows();
    return selected.length === 0;
  }
}

