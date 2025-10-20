import { Component, inject } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { NbSecurityModule } from '@nebular/security';
import { TableComponent } from '../../theme/controls/table/table.component';
import { AppTableDefDetail } from '../../theme/models/app-table-def-detail';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-home',
  imports: [
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbActionsModule,
    NbSecurityModule,
    TableModule,
    TableComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  tableDef: AppTableDefDetail[]  = [
    { header: 'Nombre', column: 'name', order: 1, display: true, filter: true },
    { header: 'Descripción', column: 'description', order: 2, display: true, filter: true }
  ]
  showSelect: boolean = true

  products: any[] = []
  selectedProducts: any[] = []

  constructor() {
    this.getUsers().subscribe(users => {
      console.log('Usuarios desde Firestore:', users);
    });
  }

  async toggleShuffle(){
    const result = await signInWithEmailAndPassword(this.auth, 'fchacong@outlook.com', 'Jo@quin88_');
      console.log('Login exitoso', result.user);
  }

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' });
  }
  
  edit(appRoleId: string): void {
    
  }

  delete(appRoleId: string) {
    
  }

}
