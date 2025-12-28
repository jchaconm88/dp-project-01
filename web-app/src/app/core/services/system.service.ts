import { inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { shareReplay, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private firebaseService = inject(FirebaseService);

  constructor() { }

  userGetList(destroy: Subject<void>) {
    return this.firebaseService.getCollection('users').pipe(takeUntil(destroy))
  }

  async userGet(userId: string) {
    return this.firebaseService.getDocument('users', userId)
  }

  async userEdit(userId: string, user: any) {
    return this.firebaseService.updateDocument('users', userId, user)
  }

  userDelete(user: any) {
    return this.firebaseService.deleteDocument('users', user);
  }

  roleGetList() {
    return this.firebaseService.getCollection('roles')
  }

  async roleGet(roleId: string) {
    return this.firebaseService.getDocument('roles', roleId)
  }

  async roleEdit(roleId: string, role: any) {
    return this.firebaseService.updateDocument('roles', roleId, role)
  }

  async roleDelete(role: any) {
    return this.firebaseService.deleteDocument('roles', role);
  }
}
