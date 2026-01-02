import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, finalize, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { UserSetComponent } from './user-set/user-set.component';
import { ContentComponent } from '@theme/controls/content/content.component';
import { TableComponent } from '@theme/controls/table/table.component';
import { AppTableDefDetail } from '@theme/models/app-table-def-detail';
import { RoleAccessService } from '@core/services/role-access.service';
import { ContentHeaderComponent } from '@theme/controls/content-header/content-header.component';
import { UserService } from '@core/services/user.service';

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
export class UserComponent implements OnInit {
  @ViewChild(TableComponent, { static: true }) table: TableComponent<User> = new TableComponent<User>();
  @ViewChild(ContentComponent, { static: true }) content: ContentComponent = new ContentComponent;
  private userService = inject(UserService);
  tableDef: AppTableDefDetail[] = [
    { header: 'Nombre', column: 'displayName', order: 1, display: true, filter: true },
    { header: 'Correo', column: 'email', order: 2, display: true, filter: true }
  ]
  private destroyRef = inject(DestroyRef);

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
      this.roleAccessService.isGranted('list', 'user').pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(canList => {
          this.content.showAlert = false
          if (!canList) {
            this.content.showAlertMessage('Acceso denegado a la lista de usuarios.');
            this.content.loading = false;
            return EMPTY;
          }
          return this.userService.userGetList().pipe(
            catchError(err => {
              this.content.showAlertMessage(err);
              return of([]);
            })
          );
        }),

      ).subscribe(users => {
        this.content.loading = false;
        this.table.setDatasource(users);
      });

      // this.roleAccessService.isGranted('list', 'user')
      //   .pipe(takeUntilDestroyed(this.destroyRef))
      //   .subscribe(canList => {
      //     if (canList) {
      //       this.content.showAlert = false
      //       this.userService.userGetList()
      //         .pipe(
      //           takeUntilDestroyed(this.destroyRef),
      //           catchError(err => {
      //             this.content.loading = false
      //             console.error(err);
      //             this.content.showAlertMessage('No se pudieron cargar los usuarios');
      //             return of([]);
      //           }),
      //           finalize(() => {
      //             this.content.loading = false
      //           })
      //         )
      //         .subscribe(users => {
      //           this.table.setDatasource(users)
      //         });
      //     }
      //     else {
      //       this.content.loading = false
      //       console.error('Acceso denegado a la lista de usuarios.');
      //       this.content.showAlertMessage('Acceso denegado a la lista de usuarios.');
      //     }
      //   });

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
          this.userService.userDelete(selected)
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

  deleteDisabled(): boolean {
    const selected = this.table.getSelectedRows();
    return selected.length === 0;
  }
}

