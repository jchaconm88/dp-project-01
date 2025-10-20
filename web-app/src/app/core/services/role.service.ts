import { effect, inject, Injectable, NgZone } from "@angular/core";
//import { onAuthStateChanged, User } from "firebase/auth";
import { BehaviorSubject, filter, firstValueFrom, Observable } from "rxjs";
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";

@Injectable({ providedIn: 'root' })
export class RoleService {
  private auth = inject(Auth);
  private firestore = inject(Firestore)
  private role$: BehaviorSubject<string> = new BehaviorSubject<string>('guest');
  private roleLoaded$ = new BehaviorSubject<boolean>(false);
  private ngZone = inject(NgZone);

  constructor() {
    this.initAuthStateListener();
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
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const role = querySnapshot.docs[0].data()['role'] || 'user';
        this.role$.next(role);
      } else {
        console.warn('Usuario sin rol asignado, usando "user" por defecto');
        this.role$.next('user');
      }
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