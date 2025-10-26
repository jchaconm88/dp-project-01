import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContentDetailComponent } from '../../../../theme/controls/content-detail/content-detail.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { NbButtonModule, NbCardModule, NbTabsetModule } from '@nebular/theme';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    NbCardModule,
    ContentDetailComponent,
    NbTabsetModule,
        NbButtonModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  userId = this.route.snapshot.paramMap.get('id');
  user: any

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
}
