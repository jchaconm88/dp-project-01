import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { NbAuthJWTToken, NbAuthService, NbAuthToken } from "@nebular/auth";
import { FirebaseService } from "./firebase.service";

@Injectable({ providedIn: 'root' })
export class RoleService {
  private nbAuthService = inject(NbAuthService);
  private firebaseService = inject(FirebaseService);
  private role$: BehaviorSubject<string> = new BehaviorSubject<string>('guest');

  constructor() {
    this.nbAuthService.onTokenChange()
      .pipe(
        filter((token: NbAuthToken): token is NbAuthJWTToken => token instanceof NbAuthJWTToken),
      )
      .subscribe(async token => {
        console.log('RoleService: onTokenChange', token);
        if (token.isValid()) {
          const payload = token.getPayload();
          await this.loadRoleFromFirestore(payload.email);
        } else {
          this.role$.next('guest');
        }
      });
  }

  private async loadRoleFromFirestore(email: string | null) {
    try {
      if (!email) {
        this.role$.next('guest');
        return;
      }
      const user = await this.firebaseService.getFirst('users', 'email', email);
      const role = user?.role || 'user';
      this.role$.next(role);
    } catch (error) {
      console.error('Error cargando rol:', error);
      this.role$.next('guest');
    } 
  }
  
  get currentRole$() {
    return this.role$.asObservable().pipe(filter(role => !!role));
  }

  getRole(): Observable<string> {
    return this.role$.asObservable();
  }
}