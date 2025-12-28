import { Component, inject, OnInit, ViewChild } from '@angular/core';
//import { AppTableDefDetail } from '../../../theme/models/app-table-def-detail';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '@theme/controls/content/content.component';
import { TableComponent } from '@theme/controls/table/table.component';
import { AppTableDefDetail } from '@theme/models/app-table-def-detail';
import { SystemService } from '@core/services/system.service';
// import { ContentComponent } from '../../../theme/controls/content/content.component';
// import { TableComponent } from '../../../theme/controls/table/table.component';
// import { SystemService } from '../../../core/services/system.service';

@Component({
  selector: 'app-role',
  imports: [
    CommonModule,
    ContentComponent,
    TableComponent
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  @ViewChild(TableComponent, { static: true }) table: TableComponent = new TableComponent;
  tableDef: AppTableDefDetail[] = [
    { header: 'Nombre', column: 'name', order: 1, display: true, filter: true },
    { header: 'Descripción', column: 'detail', order: 2, display: true, filter: true }
  ]
  private destroy$ = new Subject<void>();
  private systemService = inject(SystemService);

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
    load() {
      try {
        this.systemService.roleGetList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(roles => {
            this.table.setDatasource(roles)
          });
      } catch (error) {
        console.log(error)
        //this.alertService.showError('Error!', String(error))
      }
    }

  edit(userId: string): void {
    console.log('Editando usuario:', userId);
    this.router.navigate(['/system/user', userId]);
  }

  delete(appRoleId: string) {

  }
}
