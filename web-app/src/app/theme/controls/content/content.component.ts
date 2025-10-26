import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NbActionsModule, NbAlertModule, NbCardModule } from '@nebular/theme';

@Component({
  selector: 'dp-content',
  imports: [
    CommonModule,
    NbAlertModule,
    NbCardModule,
    NbActionsModule,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {
  @Input() title: string = ''
  showAlert = true;

  constructor() { }

  onClose() {
    this.showAlert = false;
  }
}
