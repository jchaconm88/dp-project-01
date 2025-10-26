import { Component, computed, effect, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ContentComponent } from '../../../theme/controls/content/content.component';
import { TableComponent } from '../../../theme/controls/table/table.component';
import { AppTableDefDetail } from '../../../theme/models/app-table-def-detail';
import { SystemService } from '../../../core/services/system.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Router } from '@angular/router';
import { ContentHeaderComponent } from '../../../theme/controls/content-header/content-header.component';

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
  private systemService = inject(SystemService);
  tableDef: AppTableDefDetail[] = [
    { header: 'Nombre', column: 'displayName', order: 1, display: true, filter: true },
    { header: 'Correo', column: 'email', order: 2, display: true, filter: true }
  ]
  showSelect: boolean = true
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
  }

  ngOnInit() {
    console.log('UserComponent: ngOnInit');
    this.load();
  }

  load() {
    try {
      this.systemService.userGetList()
        .pipe(takeUntil(this.destroy$))
        .subscribe(users => {
          console.log('Usuarios cargados:', users);
          this.table.setDatasource(users)
        });
    } catch (error) {
      console.log(error)
      //this.alertService.showError('Error!', String(error))
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  create() {
    this.router.navigate(['/system/user', 'new']);
  }

  edit(userId: string): void {
    console.log('Editando usuario:', userId);
    this.router.navigate(['/system/user', userId]);
  }

  delete(appRoleId: string) {

  }
}

