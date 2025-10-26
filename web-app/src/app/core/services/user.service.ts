import { inject, Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService, NbAuthToken } from '@nebular/auth';
import { BehaviorSubject, catchError, filter, from, map, of, switchMap, take } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class UserService {
  private authService = inject(NbAuthService);
  private firebaseService = inject(FirebaseService);
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.authService.onTokenChange()
      .pipe(
        switchMap((token: NbAuthToken) => {
          console.log('UserService: onTokenChange', token);
          if (token instanceof NbAuthJWTToken && token.isValid()) {
            const payload = token.getPayload();
            return from(this.userGetByEmail(payload.email)).pipe(
              map(user => ({
                id: payload.user_id,
                email: payload.email,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
              })),
              catchError(() => of(null))
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe(user => this.userSubject.next(user));
  }

  userGetByEmail(email: string) {
    console.log('UserService: userGetByEmail', email);
    return this.firebaseService.getFirst('users', 'email', email);
  }

  userGet(id: string) {
    return this.firebaseService.getDocument('users', id);
  }
}
