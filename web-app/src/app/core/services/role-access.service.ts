import { Injectable, OnDestroy } from '@angular/core';
import { NbAccessChecker, NbRoleProvider } from '@nebular/security';
import { BehaviorSubject, distinctUntilChanged, filter, firstValueFrom, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private role$ = new BehaviorSubject<string | string[] | null>(null);
  private roleLoaded = false; // 👈 nuevo flag
  private roleReady!: Promise<void>;
  private resolveRoleReady!: () => void;

  constructor(
    private roleProvider: NbRoleProvider,
    private accessChecker: NbAccessChecker
  ) {
    this.roleReady = new Promise<void>((resolve) => {
      this.resolveRoleReady = resolve;
    });
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
        this.resolveRoleReady(); // 👈 Se resuelve la promesa aquí
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

  private async waitForRole(): Promise<string | string[] | null> {
    if (!this.role$.value) {
      console.log('⏳ Esperando a que se cargue el rol...');
      await this.roleReady; // 👈 espera efectiva
    }
    return this.role$.value!;
  }

  /** Comprueba permisos, asegurando que el rol ya esté cargado */
  async isGranted(permission: string, resource: string): Promise<boolean> {
    await this.waitForRole(); // 👈 ahora sí espera de verdad al rol
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
