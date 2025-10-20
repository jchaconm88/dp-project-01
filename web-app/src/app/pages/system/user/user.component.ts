import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ContentComponent } from '../../../theme/controls/content/content.component';
import { TableComponent } from '../../../theme/controls/table/table.component';
import { AppTableDefDetail } from '../../../theme/models/app-table-def-detail';
import { SystemService } from '../../../core/services/system.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';
import { Observable, switchMap, take } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirestoreService } from '../../../core/services/firestore.service';

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
    TableComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private systemService = inject(SystemService);
  //private firestore = inject(FirestoreService<User>);
  //private firebaseService = inject(FirebaseService);
  @ViewChild(TableComponent, { static: true }) table: TableComponent = new TableComponent;
  tableDef: AppTableDefDetail[]  = [
    { header: 'Nombre', column: 'displayName', order: 1, display: true, filter: true },
    { header: 'Correo', column: 'email', order: 2, display: true, filter: true }
  ]  
  //users = this.firestore.data;


  // private refreshTrigger = signal(0);
  // private usuarios$ = computed(() => {
  //   this.refreshTrigger(); // reactivo
  //   return this.systemService.userGetList();
  // });

  // usuariosSig = toSignal(
  //   toObservable(this.refreshTrigger).pipe(
  //     switchMap(() => this.systemService.userGetList())
  //   ),
  //   { initialValue: [] }
  // );

  //usuariosSig = toSignal(this.systemService.userGetList(), { initialValue: [] });
  //users = toSignal(this.systemService.userGetList(), { initialValue: [] })
  //users = signal<any[]>(this.systemService.userGetList())
  showSelect: boolean = true
  
  constructor() {
    this.load();
    // effect(() => {
    //   // let _users = this.systemService.users();
    //   // this.users = _users;
    //   this.table.setDatasource(this.users())
    //   console.log(this.users())
    // });
  }

  ngOnInit() {
    //this.load();
  }

  load() {
    try {
      //this.table.setDatasource(this.users())
      //this.systemService.userGetList()
      // .pipe(takeUntilDestroyed())
      // .subscribe(users => {
      //   // Manejar usuarios aquí
      //   this.users = users
      // });
      this.systemService.userGetList().subscribe(users => {
        //this.users.update(users)
        this.table.setDatasource(users)
      });

      //this.firestore.loadAll('users');
      
      // let response = this.firebaseService.getCollection('users').subscribe(users => {
      //   console.log('Usuarios desde Firestore:', users);
      //   //console.log(response)
      //   this.users = users
      //   this.table.setDatasource(users)
      // });
    } catch (error) {
      console.log(error)
      //this.alertService.showError('Error!', String(error))
    }
  }

  
  edit(appRoleId: string): void {
    
  }

  delete(appRoleId: string) {
    
  }
}

