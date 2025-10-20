import { Component, inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  //private firestore = inject(Firestore);
  title = 'app-layout';

  constructor() {
    // this.getUsers().subscribe(users => {
    //   console.log('Usuarios desde Firestore:', users);
    // });
  }

  // getUsers(): Observable<any[]> {
  //   const usersCollection = collection(this.firestore, 'app-users');
  //   return collectionData(usersCollection, { idField: 'id' });
  // }
}
