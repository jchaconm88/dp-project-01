import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { NbAuthJWTToken, NbAuthService, NbAuthToken } from "@nebular/auth";
import { FirebaseService } from "./firebase.service";
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class RoleService {
  private nbAuthService = inject(NbAuthService);
  private firebaseService = inject(FirebaseService);
  private userService = inject(UserService);
  private role$: BehaviorSubject<string> = new BehaviorSubject<string>('guest');

  constructor() {
    this.nbAuthService.onTokenChange()
      .subscribe(async token => {
        console.log('RoleService: onTokenChange', token);
        if (token instanceof NbAuthJWTToken && token.isValid()) {
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
      //const user = await this.firebaseService.getFirst('users', 'email', email);
      const user = await this.userService.userGetByEmail(email);
      const role = user?.role || 'user';
      this.role$.next(role);
    } catch (error) {
      console.error('Error cargando rol:', error);
      this.role$.next('guest');
    }
  }

  roleGetCurrent(): Observable<string> {
    return this.role$.asObservable();
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