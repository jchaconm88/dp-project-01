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

  // private _user$ = new BehaviorSubject<any | null>(null);
  // user$ = this._user$.asObservable();
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // this.authService.onTokenChange()
    //   .pipe(
    //     filter((token): token is NbAuthJWTToken => token instanceof NbAuthJWTToken),
    //     filter((token) => token.isValid()),
    //     take(1)
    //   )
    //   .subscribe(async (token) => {
    //     const payload = token.getPayload();
    //     const user = await this.userGetByEmail(payload.email)
    //     this._user$.next({
    //       id: payload.user_id,
    //       email: payload.email,
    //       displayName: user?.displayName
    //     });
    //   });

    this.authService.onTokenChange()
      .pipe(
        switchMap((token: NbAuthToken) => {
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
}
