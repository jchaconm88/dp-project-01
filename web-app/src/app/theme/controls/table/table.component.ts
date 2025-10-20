import { SelectionModel } from '@angular/cdk/collections';
import { Component, ContentChildren, Directive, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PerColumnComponent } from './per-column/per-column.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { AppTableDefDetail } from '../../models/app-table-def-detail';
import { getFilterPredicate, getJsonValue } from '../../utils/utils';
import { MatButtonModule } from '@angular/material/button';

@Directive({ selector: '[tableHeader]' })
export class TableHeaderDirective {
  constructor(public readonly template: TemplateRef<any>) {}
}

@Component({
  selector: 'dp-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource!: MatTableDataSource<any>
  @Input() tableDef!: AppTableDefDetail[]
  @Output() onEdit = new EventEmitter<any>()
  @Output() onDelete = new EventEmitter<any>()
  @ContentChildren(PerColumnComponent) columns: QueryList<PerColumnComponent> = new QueryList<PerColumnComponent>();
  tableColumns!: AppTableDefDetail[]
  displayedColumns!: string[]

  selectedCols = new SelectionModel<any>(true, [])
  @Output()
  selectionChange: EventEmitter<SelectionModel<any>> = new EventEmitter<SelectionModel<any>>()
  
  itemTemplate!: TemplateRef<any>
  
  _showSelect: boolean = false
  @Input()
  set showSelect(value: boolean) {
    this._showSelect = value
    this.displaySelectColumn(value)
  }
  @Input() linkColumn: string = ''

  constructor() {
   }

  ngOnInit(): void {
    this.initDatatable()
  }

  displaySelectColumn(value: boolean){
    let index = this.displayedColumns?.findIndex(o => o == 'select')
    if (index >= 0) {
      if (!value) this.displayedColumns?.shift()
    }
    else {
      if (value) this.displayedColumns?.unshift('select')
    }
  }

  initDatatable(): void {
    this.tableDef.unshift({ header: '', column: 'select', order: 0, display: false, filter: true })
    this.tableColumns = this.tableDef.sort((a, b) => a.order - b.order)
    this.displayedColumns = this.tableColumns.filter(o => o.display == true).map(o => o.column)
    this.displayedColumns.push('options')
    this.displaySelectColumn(this._showSelect)
  }

  setDatasource(data: any[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      let filterObject = JSON.parse(filter)
      return getFilterPredicate(data, filterObject.value, filterObject.columnData)
    };
  }

  filter(value: string): void {
    let filterObject = {
      columnData: this.tableColumns,
      value: value.trim().toLowerCase()
    }
    this.dataSource.filter = JSON.stringify(filterObject)

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editHandler(id: string) {
    this.onEdit.emit(id);
  }

  deleteHandler(element: any) {
    this.onDelete.emit(element);
  }

  getValue(data: any, columnName: any, type: any) {
    return getJsonValue(data, columnName, type)
  }

  showHideSelectColumn() {
    let index = this.displayedColumns.findIndex(o => o == 'select')
    if (index >= 0) {
      this.displayedColumns.shift()
      this._showSelect = false
    }
    else {
      this.displayedColumns.unshift('select');
      this._showSelect = true
    }
  }

  isAllSelected() {
    const numSelected = this.selectedCols.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isNoneAndSendSelected() {
    let isDisabled = false
    isDisabled = this.selectedCols.selected.length > 0? false: true    
    if (!isDisabled) {
      let send = this.selectedCols.selected.find(o => o.status != 'CREADO' && o.status != 'RECHAZADA')
      if (send) isDisabled = true
    }
    return isDisabled
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selectedCols.clear();
      return;
    }

    this.selectedCols.select(...this.dataSource.data);
  }

}
