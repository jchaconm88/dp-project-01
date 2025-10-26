import { effect, inject, Injectable, NgZone } from "@angular/core";
//import { onAuthStateChanged, User } from "firebase/auth";
import { BehaviorSubject, filter, firstValueFrom, Observable } from "rxjs";
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";
import { NbAuthJWTToken, NbAuthService, NbAuthToken } from "@nebular/auth";
import { FirebaseService } from "./firebase.service";

@Injectable({ providedIn: 'root' })
export class RoleService {
  private auth = inject(Auth);
  private nbAuthService = inject(NbAuthService);
  private firebaseService = inject(FirebaseService);
  private firestore = inject(Firestore)
  private role$: BehaviorSubject<string> = new BehaviorSubject<string>('guest');
  private roleLoaded$ = new BehaviorSubject<boolean>(false);
  private ngZone = inject(NgZone);

  constructor() {
    //this.initAuthStateListener();
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

  private async initAuthStateListener() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.loadRoleFromFirestore(user.email);
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

      // const usersRef = collection(this.firestore, 'users');
      // const q = query(usersRef, where('email', '==', email));
      // const querySnapshot = await getDocs(q);

      // if (!querySnapshot.empty) {
      //   const role = querySnapshot.docs[0].data()['role'] || 'user';
      //   this.role$.next(role);
      // } else {
      //   console.warn('Usuario sin rol asignado, usando "user" por defecto');
      //   this.role$.next('user');
      // }
    } catch (error) {
      console.error('Error cargando rol:', error);
      this.role$.next('guest');
    } finally {
      this.roleLoaded$.next(true);
    }
  }

  getRole(): Observable<string> {
    return this.role$.asObservable();
  }
}