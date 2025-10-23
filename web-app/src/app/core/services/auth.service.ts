import { inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseService = inject(FirebaseService);

  constructor() { }

  userGetByEmail(email: string) {
    return this.firebaseService.getFirst('users', 'email', email);
  }
}
