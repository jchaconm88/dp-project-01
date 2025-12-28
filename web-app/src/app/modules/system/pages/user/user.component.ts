import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { UserSetComponent } from './user-set/user-set.component';
import { ContentComponent } from '@theme/controls/content/content.component';
import { TableComponent } from '@theme/controls/table/table.component';
import { SystemService } from '@core/services/system.service';
import { AppTableDefDetail } from '@theme/models/app-table-def-detail';
import { RoleAccessService } from '@core/services/role-access.service';
import { ContentHeaderComponent } from '@theme/controls/content-header/content-header.component';

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
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private roleAccessService: RoleAccessService, private windowService: NbWindowService) {
  }

  ngOnInit() {
    console.log('UserComponent: ngOnInit');
    this.load();
  }

  async load() {
    try {
      this.content.loading = true
      this.table.clearDatasource()
      this.roleAccessService.isGranted('list', 'user', this.destroy$)
        .subscribe(canList => {
          if (canList) {
            this.content.showAlert = false
            this.systemService.userGetList(this.destroy$)
              .pipe(
                catchError(err => {
                  this.content.loading = false
                  console.error(err);
                  this.content.showAlertMessage('No se pudieron cargar los usuarios');
                  return of([]);
                })
              )
              .subscribe(users => {
                this.table.setDatasource(users)
                this.content.loading = false
              });
          }
          else {
            this.content.loading = false
            console.error('Acceso denegado a la lista de usuarios.');
            this.content.showAlertMessage('Acceso denegado a la lista de usuarios.');
          }
        });

    } catch (error) {
      this.content.loading = false
      console.log(error)
      this.content.showAlertMessage(error)
    }
  }

  create() {
    const windowRef = this.windowService.open(UserSetComponent, { title: `Crear Usuario` });
    windowRef.onClose.subscribe(result => {
      if (result) {
        this.detail(result.id)
      }
    });
  }

  edit(user: any) {
    const windowRef = this.windowService.open(UserSetComponent, { title: `Editar Usuario`, context: { userId: user.id } });
    windowRef.onClose.subscribe(result => {
      if (result) {
        this.detail(result.id)
      }
    });
  }

  detail(userId: string): void {
    this.router.navigate(['/system/user', userId]);
  }

  async delete() {
    try {
      const selected = this.table.getSelectedRows()
      if (selected.length > 0) {
        if (await this.content.showConfirmMessage('¿Está seguro de eliminar el registro?', 'Eliminar')) {
          this.content.loading = true
          this.systemService.userDelete(selected)
            .subscribe({
              next: (data) => {
                this.table.clearSelectedRows()
                this.load()
              },
              error: (err) => {
                this.content.loading = false
                console.error('Error en delete:', err);
                this.content.showAlertMessage(err)
              }
            });
        }
      }
    } catch (err: any) {
      this.content.loading = false
      console.error('Error en delete:', err);
      this.content.showAlertMessage(err)
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteDisabled(): boolean {
    const selected = this.table.getSelectedRows();
    return selected.length === 0;
  }
}

