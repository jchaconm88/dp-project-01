import { Injectable } from "@angular/core";
import { NbAccessChecker, NbAclService, NbRoleProvider } from "@nebular/security";
import { RoleService } from "./role.service";
import { catchError, combineLatest, map, Observable, of, startWith } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AppAccessChecker extends NbAccessChecker {
  constructor(
    private roleService: RoleService,
    acl: NbAclService,
    roleProvider: NbRoleProvider
  ) {
    super(roleProvider, acl);
  }

  override isGranted(resource: string, permission: string): Observable<boolean> {
    return combineLatest([
      super.isGranted(resource, permission),
      this.roleService.getRole().pipe(startWith('guest'))
    ]).pipe(
      map(([defaultCheck, currentRole]) => {
        //console.log(`Verificando ${permission} en ${resource} para rol ${currentRole}`);
        return defaultCheck;
      }),
      catchError(err => {
        console.error('Error en check de permisos:', err);
        return of(false);
      })
    );
  }
}