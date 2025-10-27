import { Injectable, OnDestroy } from '@angular/core';
import { NbAccessChecker, NbRoleProvider } from '@nebular/security';
import { BehaviorSubject, distinctUntilChanged, filter, firstValueFrom, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private role$ = new BehaviorSubject<string | string[] | null>(null);

  constructor(
    private roleProvider: NbRoleProvider,
    private accessChecker: NbAccessChecker
  ) {
    // Escucha el rol actual del RoleProvider y emite cuando cambia
    this.roleProvider.getRole()
      .pipe(
        distinctUntilChanged(),
        filter(role => !!role),
        takeUntil(this.destroy$)
      )
      .subscribe(role => {
        console.log('Rol cargado en servicio:', role);
        this.role$.next(role);
      });
  }

  /** Observable público para suscribirse al rol actual */
  get currentRole$() {
    return this.role$.asObservable().pipe(filter(role => !!role));
  }

  /** Devuelve el rol actual (promesa útil para async/await) */
  async getCurrentRole(): Promise<string | string[] | null> {
    const role = this.role$.value;
    return role ? role : await firstValueFrom(this.currentRole$);
  }

  /** Comprueba permisos, asegurando que el rol ya esté cargado */
  async isGranted(permission: string, resource: string): Promise<boolean> {
    await this.getCurrentRole();
    const result = await firstValueFrom(
      this.accessChecker.isGranted(permission, resource)
    );

    return !!result;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
