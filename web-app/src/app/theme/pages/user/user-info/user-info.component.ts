import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NbButtonModule, NbCardModule, NbTabsetModule } from '@nebular/theme';
import { ContentDetailComponent } from '@theme/controls/content-detail/content-detail.component';
import { TableComponent } from "@theme/controls/table/table.component";
import { AppTableDefDetail } from '@theme/models/app-table-def-detail';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    NbCardModule,
    ContentDetailComponent,
    NbTabsetModule,
    NbButtonModule,
    TableComponent
],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  userId = this.route.snapshot.paramMap.get('id');
  user: any
  tableDef: AppTableDefDetail[] = [
    { header: 'Nombre', column: 'displayName', order: 1, display: true, filter: true },
    { header: 'Correo', column: 'email', order: 2, display: true, filter: true }
  ]

  constructor(private userService: UserService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit(): Promise<void> {
    this.userService.userGet(this.userId as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        console.log('User detail loaded:', this.user);
      });
  }

  edit(): void {
    console.log('Edit user:', this.userId);
    // Implement navigation to edit page or open edit modal
  }

  editRole(role: any): void {
    console.log('Edit user:', this.userId);
    // Implement navigation to edit page or open edit modal
  }
}
