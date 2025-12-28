import { inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from '@core/services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firebaseService = inject(FirebaseService);

  constructor() { }

  userGetList() {
    return this.firebaseService.getCollection('users')
  }

  userGet(userId: string) {
    return this.firebaseService.getDocument('users', userId)
  }

  userAdd(user: any) {
    return this.firebaseService.addDocument('users', user)
  }

  userEdit(userId: string, user: any) {
    return this.firebaseService.updateDocument('users', userId, user)
  }

  userDelete(user: any) {
    return this.firebaseService.deleteDocument('users', user);
  }
}
