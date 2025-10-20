import { inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private firebaseService = inject(FirebaseService);
  //private firestore = inject(FirestoreService<User>);
  users = signal<any[]>([]);

  constructor() { }

  userGetList() {
    //return this.firestore.loadAll('users');
    return this.firebaseService.getCollection('users')
  }
  
  // async userGet(userId: string) {
  //   return await this.firebaseService.getDocument('users', userId)
  // }
  
  // async userEdit(userId: string, user: any) {
  //   return await this.firebaseService.updateDocument('users', userId, user)
  // }
  
  // async userCreate(user: any) {
  //   let rsp = await this.firebaseService.createUser(user.email)
  //   if (rsp.user) {
  //     return this.firebaseService.addDocument('users', user);
  //   }
  //   else {
  //     throw 'No se pudo crear el usuario'
  //   }
  // }
  
  // async userDelete(user: any) {
  //   return await this.firebaseService.deleteDocument('users', user);
  // }
}
