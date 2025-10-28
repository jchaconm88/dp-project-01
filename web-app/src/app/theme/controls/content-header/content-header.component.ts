import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@Component({
  selector: 'dp-content-header',
  imports: [
    CommonModule,
    NbButtonModule,
    NbFormFieldModule,
    NbInputModule,
    NbIconModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './content-header.component.html',
  styleUrl: './content-header.component.scss'
})
export class ContentHeaderComponent implements OnInit {
  @Input() showFilter: boolean = true
  @Input() deleteDisabled: boolean = true
  @Output() onFilter = new EventEmitter<any>()
  @Output() onLoad = new EventEmitter<any>()
  @Output() onDelete = new EventEmitter<any>()
  @Output() onCreate = new EventEmitter<any>()

  constructor() { }

  ngOnInit(): void {
  } 

  filterHandler(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.onFilter.emit(value);
  }

  loadHandler() {
    this.onLoad.emit();
  }

  deleteHandler() {
    this.onDelete.emit();
  }

  createHandler() {
    this.onCreate.emit();
  }
}
