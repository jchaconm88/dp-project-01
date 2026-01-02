import { Injectable } from '@angular/core';
import { NbAccessChecker } from '@nebular/security';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {
  constructor(
      private accessChecker: NbAccessChecker,
      private roleService: RoleService
    ) {}
  
  
    isGranted(permission: string, resource: string) {
      const switched = this.roleService.roleGetCurrent().pipe(
        switchMap(() => this.accessChecker.isGranted(permission, resource)));
      return switched
    }
}
