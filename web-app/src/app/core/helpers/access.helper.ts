import { NbAccessChecker } from "@nebular/security";
import { RoleService } from "../services/role.service";
import { Injectable } from "@angular/core";
import { map, of, Subject, switchMap, takeUntil, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccessHelper {
  constructor(
    private accessChecker: NbAccessChecker,
    private roleService: RoleService
  ) { }


  isGranted(permission: string, resource: string, destroy: Subject<void>) {
    const switched = this.roleService.roleGetCurrent().pipe(
      takeUntil(destroy),
      switchMap(() => this.accessChecker.isGranted(permission, resource)));
    return switched
  }
}
